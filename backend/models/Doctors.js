const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    license: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    qualfication: {
        type: String,
        required: true,
    },
    major: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    date: {
        type: Date.now(),
    },
});

const Doctors = mongoose.model("Doctors", doctorSchema);
module.exports = Doctors;