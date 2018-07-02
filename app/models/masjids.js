/** 
 *  Masjids Model
 * **/

const Masjids     = require('../schema/masjids');
const MasjidTypes = require('../schema/masjidtypes');
const method      = {};

method.remove = (id, callback) => {
    Masjids.findByIdAndRemove(id, (err, res) => {
        if (err) throw err;
        callback(res);
    });
};

method.getByTitle = (title, callback) => {
    Masjids.findOne({title: title}, (err, masjid) => {
        callback(masjid);
    });
};

method.getById = (id, callback) => {
    Masjids.findById(id, (err, user) => {
        callback(user);
    });
};

method.getAll = callback => {
    Masjids.find({}, (err, masjids) => {
        if (err) {
            callback({ info: {code : 500, msg : "Internal server error." }});
        } else {
            if (masjids.length == 0){
                callback({ info: {code : 404, msg : "Masjids not found" }});
            } else {
                callback({ info: {code : 200, msg : "Success!" }, masjids : masjids});
            }
        }
    }).sort({date : -1});;
};

method.addMasjid = (data, callback) => {
    let masjid   = new Masjids(data);
    masjid.save(err => { 
        if(err) throw err;
        if (err) {
            callback({ info: {code : 400, msg : "An error occur!" }}); 
        } else {
            callback({ info: {code : 201, msg : "Masjid has been added successfully." }}); 
        }
    });
};

method.getMasjidTypes = callback => {
    MasjidTypes.find({}, (err, masjidtypes) => {
        if (err) throw err;
        if (err) {
            callback({ info: {code : 404, msg : "Masjid Type not found" }});
        } else {
            callback({ info: {code : 200, msg : "Success!" }, masjidtypes: masjidtypes});
        }
    });
};

module.exports = method;