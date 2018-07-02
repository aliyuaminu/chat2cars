const auth = {};

auth.ensureSignin = (req, res, next) => {
    if (req.user) {
        return next();
    } else {
        if (req.xhr) { 
            res.json({ info: {code : 500, msg : "Session expired, please signin again" }});
        } else {
            res.redirect('/users/signin');
        }
    }
}

module.exports = auth;

