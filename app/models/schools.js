/** 
 *  Schools Model
 * **/

const Schools = require('../schema/schools');
const method  = {};

method.remove = (id, callback) => {
    Schools.findByIdAndRemove(id, (err, res) => {
        if (err) throw err;
        callback(res);
    });
};

method.getByTitle = (title, callback) => {
    Schools.findOne({title: title}, (err, school) => {
        callback(school);
    });
};

method.getById = (id, callback) => {
    Schools.findById(id, (err, user) => {
        callback(user);
    });
};

method.getAll = callback => {
    Schools.find({}, (err, schools) => {
        if (err) {
            callback({ info: {code : 500, msg : "Internal server error." }});
        } else {
            if (schools.length == 0){
                callback({ info: {code : 404, msg : "Schools not found" }});
            } else {
                callback({ info: {code : 200, msg : "Success!" }, schools : schools});
            }
        }
    }).sort({date : -1});;
};

method.addSchool = (data, callback) => {
    let school   = new Schools(data);
    school.save(err => { 
        if(err) throw err;
        if (err) {
            callback({ info: {code : 400, msg : "An error occur!" }}); 
        } else {
            callback({ info: {code : 201, msg : "School has been added successfully." }}); 
        }
    });
};

module.exports = method;