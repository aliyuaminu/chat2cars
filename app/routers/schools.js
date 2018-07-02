const SchoolsModel = require('../models/schools');
const auth         = require('../config/auth');

module.exports = (express) => {
    let router = express.Router(); 
    router.get('', auth.ensureSignin, (req, res) => {
        if (req.xhr) {
            SchoolsModel.getAll(data => {
                let schools = (data.info.code === 200) ? data.schools : null;
                res.render('schools/data/list', {schools : schools});
            });
        } else {
            res.render('schools/list', {keywords: ''});
        }
    });

    router.post('/add/api', auth.ensureSignin, (req, res) => {
        let data = {
            creator   : req.user.id,
            title     : req.body.title, 
            state     : req.body.state, 
            lga       : req.body.lga,
            address   : req.body.address,
            committee : {
                hm : {fullname : req.body.hmfullname, mobile: req.body.hmmobile},
                vc : {fullname : req.body.vcfullname, mobile: req.body.vcmobile},
            }
        };
        if (data.title.length == 0 || data.state.length == 0 || data.lga.length == 0 || data.address.length == 0 || data.committee.hm.fullname.length == 0 || data.committee.hm.mobile.length == 0 || data.committee.vc.fullname.length == 0 || data.committee.vc.mobile.length == 0) {
            res.json({ info: {code : 400, msg : "All field is required." }});
        } else {
            SchoolsModel.addSchool(data, result => { 
                res.json(result); 
            });
        }
    });

    router.post('/remove', auth.ensureSignin, (req, res) => {
        let id = req.body.id;
        SchoolsModel.remove(id, result => {
            res.json({ info: {code : 204, msg : "Deleted" }});
        });
    });

    return router;
}