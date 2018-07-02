/** 
 *  Masjid Schema
 * **/

const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const MasjidSchema = new Schema({
    creator   : { type: Schema.Types.ObjectId, ref: 'Users' },
    type      : { type: Schema.Types.ObjectId, ref: 'Masjidtypes' },
    title     : { type: String, required: true  },
    state     : { type: String, required: true  },
    lga       : { type: String, required: true  },
    committee : { type: Object, required: true  },
    address   : { type: String, required: true  },
    date      : { type: Date, default: Date.now },
});

MasjidSchema.pre('save', (next) => {
    next();
});

module.exports = mongoose.model('Masjids', MasjidSchema);

