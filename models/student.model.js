const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = Schema({ 
    name: { type: String , required: true },
    email: { type: String , required: true },  
    age: { type: Number , required: true },
    gender: { type: String },
    contact: { type: String , required: true },
    image: { type: String }, 
    faculty_id : { type: Schema.Types.ObjectId , default : null}, 
    isDeleted: { type: Boolean, enum: [true, false], default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('student', studentSchema);