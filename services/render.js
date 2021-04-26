exports.homeRoutes=(req,res)=>{
    checkIfAdmin(req).then((authObj) => {
        res.render("index", {isLoggedIn:authObj.isAuthenticated, isAdmin:authObj.isAdmin, error:""})
    })
}

exports.indexNotFilledSearch=(req,res)=>{
    checkIfAdmin(req).then((authObj) => {
        res.render("index", {isLoggedIn:authObj.isAuthenticated, isAdmin:authObj.isAdmin, error: "Proszę o wypełnienie wszystkich pól "})
    })
}


exports.login=(req,res)=>{
    res.render("login", {isLoggedIn:req.isAuthenticated() ,error:""})
}


exports.register=(req,res)=>{
    res.render("register", {isLoggedIn:req.isAuthenticated() ,error:null})
}


exports.registerErrors=(req,resultBody,res)=>{
    res.render("register", {isLoggedIn:req.isAuthenticated() , error:resultBody})
}


exports.search=(req, resultQuery, res)=>{
    checkIfAdmin(req).then((authObj) => {
        const {search_rows, Difference_In_Days, place, dateStart, dateEnd, type_name} = resultQuery;
        res.render("search", {isLoggedIn:authObj.isAuthenticated, isAdmin:authObj.isAdmin, results: search_rows, Difference_In_Days, place, dateStart, dateEnd, type_name})
    })
}

exports.rented=(req, resultQuery, res)=>{
    checkIfAdmin(req).then((authObj) => {
        const {result, Difference_In_Days} = resultQuery;
        res.render("rented", {isLoggedIn:req.isAuthenticated(), isAdmin:authObj.isAdmin, results: resultQuery, error: ""})
    })
}

exports.rentedErrorChangeDate=(req, resultQuery, res)=>{
    checkIfAdmin(req).then((authObj) => {
        const {result, Difference_In_Days} = resultQuery;
        res.render("rented", {isLoggedIn:req.isAuthenticated(), isAdmin:authObj.isAdmin, results: resultQuery, error: "Wybrane daty są zajęte."})
    })
}

exports.adminpanel=(req, resultQuery, res)=>{
    res.render("adminPanel", {isLoggedIn:req.isAuthenticated(), isAdmin:true, results: resultQuery})
}

const checkIfAdmin = (req) => {
    return new Promise((resolve, reject) => {
        const isAuthenticated = req.isAuthenticated();
        var isAdmin = false;
        if(isAuthenticated){
            isAdmin = req.user.is_admin;
        }

        console.log(isAuthenticated, isAdmin);
        resolve({isAuthenticated, isAdmin});
    })
}