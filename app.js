const express = require('express');
const bodyParser = require('body-parser')
const db = require('./queries');
const { request, response } = require('express');
const app = express();
const port = 3000;

app.use(express.json());


//ROUTES
app.get('/', (req,res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' });
});

app.get('/user/:user_id', (request, response) => {
    db.getUserById(request, (result) =>{
        response.status(200).json(result);
    })
});

app.post('/user/register', (request, response) => {
    db.createUser(request, (result) =>{
        console.log(result);
        response.status(200).send("ADDED NEW USER");
    })
});

app.get('/search', db.getCarsBySearch);

app.get('/rented',(request, response) => {
    db.getUserRental(request, (result) => {
        console.log(result);
        response.status(200).json(result);
    })
});

app.post('/rent', (request, response) => {
    const rented = {correct:true};

    db.addRental(request, (result) => {

        response.status(200).json(rented);
    })
});

app.get('/allRent', db.getAllRental);


app.post('/cancelRental', (request, response) => {
    const cancel = {rental_id:request.body.rental_id, status_id:3};

    db.changeRentalStatus(cancel, (result) => {

        response.status(200).json(result);
    })
});

app.post('/approveRental', (request, response) => {
    const cancel = {rental_id:request.body.rental_id, status_id:2};

    db.changeRentalStatus(cancel, (result) => {

        response.status(200).json(result);
    })
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })