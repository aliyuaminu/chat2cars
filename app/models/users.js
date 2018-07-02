/** 
 *  Users Model
 * **/

const Users  = require('../schema/users');
const States = require('../schema/states');
const bcrypt = require('bcrypt-nodejs');
const method = {};

method.getById = (id, callback) => {
    Users.findById(id, (err, user) => {
        callback(user);
    });
};

method.getByEmail = (email, callback) => {
    Users.findOne({email: email}, (err, user) => {
        callback(user);
    });
};

method.getByMobile = (mobile, callback) => {
    Users.findOne({mobile: mobile}, (err, user) => {
        callback(user);
    });
};

method.signup = (data, callback) => {
    let user  = new Users(data);
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            user.save(err => { 
                if (err) throw err;
                if (err) {
                    callback({ info: {code : 400, msg : "An error occur!" }}); 
                } else {
                    callback({ info: {code : 201, msg : "Signed up successfully." }}); 
                }
            });
        });
    });
};

method.signin = (data, callback) => {
    Users.findOne({email: data.email}).select('password').exec((err, user) => {
        if (err) {
            callback({ info: {code : 400, msg : "An error occur!" }});
        } else {
            if (user) {
                let compare = bcrypt.compareSync(data.password, user.password);
                if (compare) {
                    callback({ info: {code : 200, msg : "Success" }, user: user});
                } else {
                    callback({ info: {code : 400, msg : "Incorrect Username or Password" }});
                }
            } else {
                callback({ info: {code : 404, msg : "User not found!" }});
            }
        }
    });
};

method.getAll = callback => {
    Users.find({}, (err, users) => {
        if (err) {
            callback({ info: {code : 404, msg : "Users not found" }});
        } else {
            callback({ info: {code : 200, msg : "Success!" }, users: users});
        }
    });
};


module.exports = method;