const mongoose = require('mongoose');
const Schemae = mongoose.Schema;

const schoolSchema = Schemae({
    name: { type: String , required: true },
    email: { type: String , required: true }, 
    contact: { type: String , required: true },  
    isDeleted: { type: Boolean, enum: [true, false], default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('school', schoolSchema);