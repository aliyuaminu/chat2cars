/** 
 *  Users Schema
 * **/

const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const UserSchema = new Schema({
    fullname : {type: String, required: true},
    gsm      : {type: String, required: true},
    email    : {type: String, required: true},
    password : {type: String, required: true, select: false},
    date     : {type: Date, default: Date.now }
});

UserSchema.pre('save', (next) => {
    next();
});

UserSchema.method.comparePassword = (password) => {
    let user = this;
    return bcypt.compareSync(password, user.password);
}

module.exports = mongoose.model('Users', UserSchema);

