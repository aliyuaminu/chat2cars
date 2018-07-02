/** 
 *  Members Model
 * **/

const Members = require('../schema/members');
const method  = {};

method.remove = (id, callback) => {
    Members.findByIdAndRemove(id, (err, res) => {
        if (err) throw err;
        callback(res);
    });
};

method.getByEmail = (email, callback) => {
    Members.findOne({email: email}, (err, user) => {
        callback(user);
    });
};

method.getByMobile = (mobile, callback) => {
    Members.findOne({mobile: mobile}, (err, user) => {
        callback(user);
    });
};

method.getById = (id, callback) => {
    Members.findById(id, (err, user) => {
        callback(user);
    });
};

method.getAll = callback => {
    Members.find({}, (err, members) => {
        if (err) {
            callback({ info: {code : 500, msg : "Internal server error." }});
        } else {
            if (members.length == 0){
                callback({ info: {code : 404, msg : "Members not found" }});
            } else {
                callback({ info: {code : 200, msg : "Success!" }, members : members});
            }
        }
    }).sort({date : -1});
};

method.addMember = (data, callback) => {
    let member   = new Members(data);
    member.save(err => { 
        if(err) throw err;
        if (err) {
            callback({ info: {code : 400, msg : "An error occur!" }}); 
        } else {
            callback({ info: {code : 201, msg : "Member has been added successfully." }}); 
        }
    });
};

module.exports = method;