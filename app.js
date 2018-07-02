const express       = require('express');
const app           = express();
const passport      = require('passport');
const bodyParser    = require('body-parser');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const flash         = require('connect-flash');
const config        = require('./app/config/config');
const session       = require('express-session');
const mongoose      = require('mongoose');

const home          = require('./app/routers/home')(express);
const users         = require('./app/routers/users')(express, passport);
//const members       = require('./app/routers/members')(express);
//const masjids       = require('./app/routers/masjids')(express);
//const schools       = require('./app/routers/schools')(express);

mongoose.connect(config.database, (err) => {
    if (err) {
        throw err;
    } else {
        console.log("Connected to the database...");
    }
});

require('./app/config/passport')(passport); // passport for configuration

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Cookie Parser Middleware
app.use(cookieParser());

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// Session Middleware
app.use(session({ secret : config.secret_key, saveUninitialized : true, resave : true, cookie: { maxAge : 3600000 * 24 * 7 } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error   = req.flash('error');
    res.locals.user    = req.user;
    next();
});

app.use('/', home);
app.use('/users', users);
//app.use('/members', members);
//app.use('/masjids', masjids);
//app.use('/schools', schools);

app.listen(config.port, (err) => {
    if (err) {
        throw err;
    } else {
        console.log('Server started on port '+config.port+'...');
    }
});