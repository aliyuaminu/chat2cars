const UsersModel = require('../models/users');

module.exports   = (express, passport) => {
    let router   = express.Router(); 

    /*router.get('', (req, res) => {
        if (req.isAuthenticated()) res.redirect('/'); else res.render('user/signin');
    }).get('/signin', (req, res) => { 
        if (req.isAuthenticated()) res.redirect('/'); else res.render('user/signin');
    });*/

    router.get('/all', (req, res) => {
        UsersModel.getAll(result => {
            res.json(result);
        });
    });

    router.post('/signup', (req, res) => {
        let data = {fullname : req.body.fullname, gsm : req.body.gsm, email : req.body.email, password : req.body.password};

        if (data.fullname.length == 0 || data.gsm.length == 0 || (data.email.length == 0 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email) == false) || data.password.length == 0) {
            res.json({ info: {code : 400, msg : "All field is required." }});
        } else {
            UsersModel.getByMobile(data.gsm, user => {
                if (user == null) {
                    UsersModel.getByEmail(data.email, user => {
                        if (user == null) {
                            UsersModel.signup(data, result => { res.redirect('/signin'); });
                        } else {
                            console.log("E-mail address is exist already.");
                            res.redirect('/signup');
                            //res.json({ info: {code : 400, msg : "E-mail address is exist already." }});
                        }
                    });
                } else {
                    console.log("Phone number is exist already.");
                    res.redirect('/signup');
                    //res.json({ info: {code : 400, msg : "Phone number is exist already." }});
                }
            });
        }
    });

    router.post('/signin', passport.authenticate('local-user-signin', {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
    }), (req, res) => {
        res.redirect('/');
    });

    router.get('/signout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    return router;
}