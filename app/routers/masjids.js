const MasjidsModel = require('../models/masjids');
const auth         = require('../config/auth');

module.exports = (express) => {
    let router = express.Router(); 
    router.get('', auth.ensureSignin, (req, res) => {
        if (req.xhr) {
            MasjidsModel.getAll(data => {
                let masjids = (data.info.code === 200) ? data.masjids : null;
                res.render('masjids/data/list', {masjids : masjids});
            });
        } else {
            res.render('masjids/list', {keywords: ''});
        }
    });

    router.post('/add/api', auth.ensureSignin, (req, res) => {
        let data = {
            creator   : req.user.id,
            type      : req.body.masjidtype, 
            title     : req.body.masjidtitle, 
            state     : req.body.state, 
            lga       : req.body.lga,
            address   : req.body.address,
            committee : {
                liman : {fullname : req.body.limanfullname, mobile: req.body.limanmobile},
                naibi : {fullname : req.body.naibifullname, mobile: req.body.naibimobile},
                ladan : {fullname : req.body.ladanfullname, mobile: req.body.ladanmobile}
            }
        };

        if (data.type.length == 0 || data.title.length == 0 || data.state.length == 0 || data.lga.length == 0 || data.address.length == 0 || data.committee.liman.fullname.length == 0 || data.committee.liman.mobile.length == 0 || data.committee.naibi.fullname.length == 0 || data.committee.naibi.mobile.length == 0 || data.committee.ladan.fullname.length == 0 || data.committee.ladan.mobile.length == 0) {
            res.json({ info: {code : 400, msg : "All field is required." }});
        } else {
            MasjidsModel.addMasjid(data, result => { 
                res.json(result); 
            });
        }
    });

    router.get('/types', (req, res) => {
        MasjidsModel.getMasjidTypes(result => {
            res.json(result);
        });
    });

    router.post('/remove', auth.ensureSignin, (req, res) => {
        let id = req.body.id;
        MasjidsModel.remove(id, result => {
            res.json({ info: {code : 204, msg : "Deleted" }});
        });
    });

    return router;
}