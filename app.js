const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const moment = require("moment")
const Doctor = require('./model')
const Appointment = require('./model1')

const app = express()

app.use(express.json())
app.use(cors({origin: '*'}))
mongoose
  .connect(
    "mongodb+srv://vinay:vinay@cluster0.dqxqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log('DB Connected..'))
  .catch(err => console.log(err))



// Get all doctors
app.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/doctors/:id', async (req, res) => {
  try {
    const doctorId = req.params.id; // Get doctor ID from the URL parameter
    const doctor = await Doctor.findById(doctorId); // Fetch doctor from the database by ID

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' }); // Handle case if doctor doesn't exist
    }

    res.json(doctor); // Return the doctor details in JSON format
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' }); // Handle server errors
  }
});


// Get available slots for a doctor on a given date
app.get('/doctors/:id/slots', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).send('Date is required');

    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).send('Doctor not found');

    const startTime = moment(date + ' ' + doctor.workingHours.start, 'YYYY-MM-DD HH:mm');
    const endTime = moment(date + ' ' + doctor.workingHours.end, 'YYYY-MM-DD HH:mm');

    // Fetch all booked appointments for the doctor on that date
    const bookedAppointments = await Appointment.find({
      doctorId: id,
      date: { $gte: startTime.toDate(), $lt: endTime.toDate() },
    });

    // Extract booked time slots in 'HH:mm' format
    const bookedTimes = bookedAppointments.map(app => moment(app.date).format('HH:mm'));

    // Generate all possible slots
    let slots = [];
    let currentTime = startTime.clone();

    while (currentTime.isBefore(endTime)) {
      let slotTime = currentTime.format('HH:mm');

      // Only add slot if it is NOT in booked times
      if (!bookedTimes.includes(slotTime)) {
        slots.push(slotTime);
      }

      currentTime.add(30, 'minutes'); // Assuming 30-minute slots
    }

    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


//Post a doctor

app.post('/doctors', async (req, res) => {

  try {
    const { name,workingHours,specialization} = req.body;
    const newDoctor = new Doctor({ name,workingHours,specialization});
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Create an appointment
app.post('/appointments', async (req, res) => {
  try {
    let { doctorId, date, duration, appointmentType, patientName, notes } = req.body;

    // Convert date string to a proper Date object
    date = moment(date, 'YYYY-MM-DD HH:mm').toDate();

    // Check if the slot is already booked
    const appointmentExists = await Appointment.findOne({ doctorId, date });
    if (appointmentExists) return res.status(400).send('Slot already booked');

    const newAppointment = new Appointment({ doctorId, date, duration, appointmentType, patientName, notes });
    await newAppointment.save();

    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Get all appointments
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

//Update appointment

// Update an appointment
app.put('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, duration, appointmentType, patientName, notes } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { date, duration, appointmentType, patientName, notes },
      { new: true }
    );

    if (!updatedAppointment) return res.status(404).send('Appointment not found');

    res.json(updatedAppointment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Delete an appointment
app.delete('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) return res.status(404).send('Appointment not found');
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(3000, () => console.log('Server running http://localhost:3000'))
