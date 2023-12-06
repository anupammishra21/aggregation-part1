const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facultySchema = Schema({
    name: { type: String , required: true },   
    contact: { type: String , required: true }, 
    no_of_teachers: { type: Number , required: true }, 
    school_id : { type: Schema.Types.ObjectId , default : null}, 
    isDeleted: { type: Boolean, enum: [true, false], default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('faculty', facultySchema);