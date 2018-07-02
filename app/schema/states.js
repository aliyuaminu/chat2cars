/** 
 *  States Schema
 * **/

const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;
const StateSchema = new Schema({});

StateSchema.pre('save', (next) => {
    next();
});

module.exports = mongoose.model('States', StateSchema);

