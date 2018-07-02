const auth      = require('../config/auth');
const homeModel = require('../models/home'); 
let   logedin   = 0;
let   userdata  = {fullname: '', gsm: '', email: ''};

module.exports = (express) => {
    let router = express.Router(); 
    router.get('', function (req, res) {
        if (req.isAuthenticated())  logedin = 1; else logedin = 0;
        if (req.xhr) {
            res.render('data/index');
        } else {
            res.render('index', {keywords: '', logedin: logedin, user : req.user || userdata});
        }
    });

    router.get('/about', function (req, res) {
        if (req.isAuthenticated()) logedin = 1; else logedin = 0;
        if (req.xhr) {
            res.render('data/about');
        } else {
            res.render('about', {keywords: '', logedin: logedin, user : req.user || userdata});
        }
    });

    router.get('/signin', function (req, res) {
        if (req.isAuthenticated()) res.redirect('/'); else res.render('signin', {logedin: logedin, user : req.user || userdata});
    });

    router.get('/signup', function (req, res) {
        if (req.isAuthenticated()) res.redirect('/'); else res.render('signup', {logedin: logedin, user : req.user || userdata});
    });

    router.get('/faqs', function (req, res) {
        if (req.isAuthenticated()) logedin = 1; else logedin = 0;
        if (req.xhr) {
            res.render('data/faqs');
        } else {
            res.render('faqs', {keywords: '', logedin: logedin, user : req.user || userdata});
        }
    });

    router.get('/post/ad', auth.ensureSignin, function (req, res) {
        if (req.isAuthenticated()) logedin = 1; else logedin = 0;
        if (req.xhr) {
            res.render('data/post-ad');
        } else {
            
            res.render('post-ad', {keywords: '', logedin: logedin, user : req.user || userdata});
        }
    });

    router.get('/profile', auth.ensureSignin, function (req, res) {
        if (req.isAuthenticated()) logedin = 1; else logedin = 0;
        if (req.xhr) {
            res.render('data/profile');
        } else {
            res.render('profile', {keywords: '', logedin: logedin, user : req.user || userdata});
        }
    });

    router.get('/search/:keywords', auth.ensureSignin, function (req, res) {
        if (req.isAuthenticated()) logedin = 1; else logedin = 0;
        let keywords = req.params.keywords.split('+').join(' ');
        if (req.xhr) {
            homeModel.search(keywords, result => {
                res.render('home/data/search-res', {result : result, keywords: keywords});
            });
        } else {
            res.render('home/search', {keywords: keywords, logedin: logedin, user : req.user || userdata});
        }
    });

    return router;
}