const mongoose = require("mongoose");

const Doctor = new mongoose.Schema({
  name: { type: String, required: true },
  workingHours: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  specialization: { type: String }
});

module.exports = mongoose.model("Doctor", Doctor);
