if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
const express = require('express');
const bodyParser = require('body-parser')
const { request, response } = require('express');
const session = require('express-session')
const passport = require('passport');
const db = require('./queries');

const initializePassport = require('./passport-config');
const { checkIfUsernameExist } = require('./queries');
const flash = require('express-flash');

initializePassport(
  passport, 
  username => {return db.getUserByUsername(username)},
  user_id => {return db.getUserById(user_id)}
);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

//Set Views
app.set('views', './views')
app.set('view engine', 'ejs')


//load routers
app.use(require('./routes/router'));

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })

