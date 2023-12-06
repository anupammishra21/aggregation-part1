const mongoose = require('mongoose');
const Schemae = mongoose.Schema;

const crudSchema = Schemae({
    fname: { type: String, },
    lname: { type: String },
    fullname: { type: String },
    email: { type: String },   
    password: { type: String },  
    image: { type: String },
    isDeleted: { type: Boolean, enum: [true, false], default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('MMlogReg', crudSchema);