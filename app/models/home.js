/** 
 *  Home Model
 * **/

const Members = require('../schema/members');
const Masjids = require('../schema/masjids');
const Schools = require('../schema/schools');
const method  = {};

method.statistic = callback => {
    let members = Members.find({}).count();
    let masjids = Masjids.find({}).count();
    let schools = Schools.find({}).count();

    callback({members: members, masjids : masjids, schools : schools});
}

method.search = (keywords, callback) => {
    Members.find({$text: {$search: keywords}}, (err, members) => {
        if (err) throw err;
        Masjids.find({$text: {$search: keywords}}, (err, masjids) => {
            if (err) throw err;
            Schools.find({$text: {$search: keywords}}, (err, schools) => {
                if (err) throw err;
                callback({members: members, masjids : masjids, schools : schools});
            });
        });
    });
};

module.exports = method;