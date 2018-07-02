/** 
 *  Masjid Type Schema
 * **/

const mongoose         = require('mongoose');
const Schema           = mongoose.Schema;
const MasjidTypeSchema = new Schema({});

MasjidTypeSchema.pre('save', (next) => {
    next();
});

module.exports = mongoose.model('Masjidtypes', MasjidTypeSchema);

