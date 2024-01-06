const mongoose = require('mongoose')

const Booking = new mongoose.Schema({
  bookingid: {
    type: String,
    required: [true, `Booking must have a booking id`],
    unique: [true, 'Booking must be unique'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'canceled'],
    default: 'pending',
  },
}, {timestamps: true})

module.exports = mongoose.model('Booking', Booking)
