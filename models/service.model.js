const mongoose = require('mongoose')

const Service = new mongoose.Schema({
  serviceid: {
    type: String,
    required: [true, `Category must have a category id`],
    unique: [true, 'Category must be unique'],
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  imageUrl: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    enum: ['sewing', 'fashionDesign'],
  },
}, {timestamps: true})

module.exports = mongoose.model('Service', Service)
