const mongoose  = require('mongoose')

const Appointment = new mongoose.Schema({
    doctorId: String,
    date: String,
    duration: Number,
    appointmentType: String,
    patientName: String,
    notes: String,
  });

  module.exports = mongoose.model('Appointment', Appointment);