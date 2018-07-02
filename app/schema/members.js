/** 
 *  Members Schema
 * **/

const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const MemberSchema = new Schema({
    creator  : { type: Schema.Types.ObjectId, ref: 'Users' },
    fullname : { type: String, required: true },
    mobile   : { type: String, required: true },
    state    : { type: String, required: true },
    lga      : { type: String, required: true },
    email    : String,
    address  : { type: String, required: true },
    date     : { type: Date, default: Date.now },
});

MemberSchema.pre('save', (next) => {
    next();
});

module.exports = mongoose.model('Members', MemberSchema);

