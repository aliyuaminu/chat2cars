const MembersModel = require('../models/members');
const auth         = require('../config/auth');

module.exports = (express) => {
    let router = express.Router(); 
    router.get('', auth.ensureSignin, (req, res) => {
        if (req.xhr) {
            MembersModel.getAll(data => {
                let members = (data.info.code === 200) ? data.members : null;
                res.render('members/data/list', {members : members});
            });
        } else {
            res.render('members/list', {keywords: ''});
        }
    });
    
    router.get('/grid', auth.ensureSignin, (req, res) => {
        if (req.xhr) {
            res.render('members/data/grid');
        } else {
            res.render('members/grid', {keywords: ''});
        }
    });
    
    router.get('/list', auth.ensureSignin, (req, res) => {
        if (req.xhr) {
            res.render('members/data/list');
        } else {
            res.render('members/list', {keywords: ''});
        }
    });

    router.post('/add/api', auth.ensureSignin, (req, res) => {
        let data = {
            creator  : req.user.id,
            fullname : req.body.fullname, 
            mobile   : req.body.mobile, 
            state    : req.body.state, 
            lga      : req.body.lga,
            email    : req.body.email, 
            address  : req.body.address
        };

        if (data.fullname == '' || data.mobile == '' || data.state == '' || data.lga == '' || data.address == '') {
            res.json({ info: {code : 400, msg : "All field is required." }});
        } else {
            MembersModel.getByMobile(data.mobile, user => {
                if (user == null) {
                    if (data.email != '' && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email) == true) {
                        MembersModel.getByEmail(data.email, user => {
                            if (user == null) {
                                MembersModel.addMember(data, result => { res.json(result); });
                            } else {
                                res.json({ info: {code : 400, msg : "E-mail address is exist already." }});
                            }
                        });
                    } else {
                        MembersModel.addMember(data, result => { res.json(result); });
                    }
                } else {
                    res.json({ info: {code : 400, msg : "Phone number is exist already." }});
                }
            });
        }
    });

    router.post('/remove', auth.ensureSignin, (req, res) => {
        let id = req.body.id;
        MembersModel.remove(id, result => {
            res.json({ info: {code : 204, msg : "Deleted" }});
        });
    });

    return router;
}