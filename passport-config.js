const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');


function initialize(passport, getUserByUsername, getUserById){
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username);
        if(user == null || user.length == 0){
            return done(null, false, {message : 'Błędna nazwa użytkownika lub hasło'});
        }

        try {
            if(await bcrypt.compare(password, user[0].password)){
                return done(null, user[0]);
            }
            else{
                return done(null, false, {message : 'Błędna nazwa użytkownika lub hasło'});
            }
        } catch (e){
            done(e);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'username'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.user_id))
    passport.deserializeUser((id, done) => {
        getUserById(id).then( (gotUser) => {
            return done(null, gotUser[0]);
        })
    })
}

module.exports = initialize;