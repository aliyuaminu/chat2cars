/** 
 *  Schools Schema
 * **/

const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const SchoolSchema = new Schema({
    creator   : { type: Schema.Types.ObjectId, ref: 'Users' },
    title     : { type: String, required: true  },
    state     : { type: String, required: true  },
    lga       : { type: String, required: true  },
    committee : { type: Object, required: true  },
    address   : { type: String, required: true  },
    date      : { type: Date, default: Date.now },
});

SchoolSchema.pre('save', (next) => {
    next();
});

module.exports = mongoose.model('Schools', SchoolSchema);

