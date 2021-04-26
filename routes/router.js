const { request } = require('express');
const express = require('express');
const route = express.Router();
const db = require('../queries');
const services = require('../services/render')
const registerValidation = require('../services/registerValidation.js')
const bcrypt = require('bcrypt');
const authCheck = require('../services/authenticationCheck');

const passport = require('passport');


//ROUTES With VIEWS
route.get('/', services.homeRoutes);

route.get('/search', services.search);

route.get('/login', authCheck.checkNotAuthenticated, services.login);

route.get('/testapp', (request, response) =>{
    console.log(passport);
})

route.get('/register', services.register);

route.get('/user/:user_id', (request, response) => {
    db.getUserById(request, (result) => {
        response.status(200).json(result);
    })
});

route.post('/register', async (request, response) => {
    //console.log(request.body)
    const resultBody = { usernameTaken: false, emailTaken: false, emailsDoesNotMatch: false, passwordsDoesNotMatch: false}
    var hashedPassword = "";
    try {
        hashedPassword = await bcrypt.hash("" + request.body.password, 10)

    } catch {
        console.log("ERROR");
    }
    resultBody.emailTaken = await db.checkIfEmailExist(request.body.emailTaken, response);
    resultBody.usernameTaken = await db.checkIfUsernameExist(request.body.username, response);
    console.log(resultBody.emailTaken,resultBody.usernameTaken);
    //Check If email/password fields are matching
    resultBody.passwordsDoesNotMatch = (request.body.password != request.body.passwordRepeat)
    resultBody.emailsDoesNotMatch = (request.body.email != request.body.emailRepeat)
    console.log(resultBody);

    const newUser = {
        name: request.body.name,
        surname: request.body.surname,
        username: request.body.username,
        email: request.body.email,
        companyName: request.body.companyName,
        password: hashedPassword
    }

    if (resultBody.usernameTaken == false && resultBody.emailTaken == false 
        && resultBody.emailsDoesNotMatch == false && resultBody.passwordsDoesNotMatch == false) {    
        //db.createUser(newUser, (result) => {
         //   console.log(result);
        //    response.status(200).send("ADDED NEW USER");
       // })
        const result = await db.createUser(newUser,response);
        //console.log(result);
        services.login(request, response);
    }
    else{
        services.registerErrors(request,resultBody, response);
    }

});


route.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

route.get('/logout', function (req, res){
    req.session.destroy(function (err) {
      res.redirect('/'); 
    });
  });

//app.get('/search', db.getCarsBySearch);

route.get('/searchQuery', async (request, response) => {
    console.log(request.query);

    if(Object.keys(request.query).length === 0){
        response.redirect("/")
    }

    const place = request.query.place;  

    if (request.query.place.length == 0 || request.query.dateStart.length == 0 || request.query.dateStart.length == 0) {
        services.indexNotFilledSearch(request, response);
    }
    else {
        var dateStart = new Date(request.query.dateStart);
        var dateEnd = new Date(request.query.dateEnd);
        var Difference_In_Time = dateEnd.getTime() - dateStart.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        var isAuthenticated = request.isAuthenticated();

        db.getCarsBySearch(request.query, (result) => {
            var search_rows = result.result;
            var type_name = result.type;
            services.search(request, {search_rows, Difference_In_Days, place, dateStart, dateEnd, type_name }, response);
        })
        //db.getCarsBySearch(request, (result) =>{
        //res.render("search", {text: "This is search"})
        //})
    }
});

route.get('/rented', authCheck.checkAuthenticated, (request, response) => {
    console.log(request.user.user_id);
    db.getUserRental(request, (result) => { 
        services.rented(request, result, response);
    })
});


route.post('/rent', authCheck.checkAuthenticated, async (request, response) => {
    const rented = { correct: true };
    const { car_id, start_date, end_date } = request.body;
    const user_id = request.user.user_id;
    //const user_id = 1;
    const rental_date = new Date(Date.now());
    var Difference_In_Time = new Date(end_date).getTime() - new Date(start_date).getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    const car_price = await db.getCarPrice(car_id);
    const price = car_price * Difference_In_Days;

    console.log(user_id, car_id, start_date, end_date, rental_date, price)

    db.addRental(user_id, car_id, start_date, end_date, rental_date, price,  (result) => {
        console.log(result);
        console.log("Rented");
        response.redirect("/rented");
    })
});

route.get('/adminPanel', authCheck.checkAuthenticated, authCheck.checkIfAdmin, (request, response) => {
    const rented = { correct: true };

    db.getAllRental(request, (result) => {
        services.adminpanel(request, result, response);
    })
});



route.post('/cancelRental/:rental_id', authCheck.checkAuthenticated, async (request, response) => {
    console.log(request.params.rental_id);
    const cancel = { rental_id: request.params.rental_id, status_id: 3 };
    var rentalBelongsToUser = true;
    const isAdmin = request.user.is_admin;

    if(!request.user.is_admin){
        rentalBelongsToUser = await db.rentalBelongsToUser(request.user.user_id, cancel.rental_id);
    }
    if(rentalBelongsToUser)
        db.changeRentalStatus(cancel, (result) => {
            if(isAdmin){
                console.log("DO PANELU ADMINA")
                response.redirect("/adminPanel");
            }    
            else{
                console.log("DO PANELU USERA")
                response.redirect("/rented"); 
            }     
        })
    else{
        console.log("Rental does not belong to user")
        response.redirect("/rented");
    }

});


route.post('/changeRentalDates', async (request, response) => {
    console.log("Change rental dates");
    console.log(request.body);
    var rentalBelongsToUser = true;
    //Add overlaping dates cause

    const isAdmin = request.user.is_admin;

    if(!request.user.is_admin){
        rentalBelongsToUser = await db.rentalBelongsToUser(request.user.user_id, request.body.rental_id);
    }
    if(rentalBelongsToUser){
        db.changeRentalDates(request, (result) => {
            console.log(result);
            response.json({ correctChange: result});
        })
    }

});


route.post('/approveRental/:rental_id', authCheck.checkAuthenticated, authCheck.checkIfAdmin, (request, response) => {
    const approve = { rental_id: request.params.rental_id, status_id: 2 };

    db.changeRentalStatus(approve, (result) => {

        response.redirect("/adminPanel");
    })
});

module.exports = route