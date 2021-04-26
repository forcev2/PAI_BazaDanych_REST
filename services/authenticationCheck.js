const checkAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    
    res.redirect('/login');
  }
  
const checkNotAuthenticated = (req, res, next) =>{
    if(req.isAuthenticated()){
        res.redirect('/');
    }

    return next();
}

const checkIfAdmin = (req, res, next) => {
    if(req.user.is_admin){
        return next();
    }


    res.redirect('/');
}

module.exports = {
    checkAuthenticated, 
    checkNotAuthenticated,
    checkIfAdmin
}
