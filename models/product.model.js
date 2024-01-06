const mongoose = require('mongoose')

const Product = new mongoose.Schema({
  productid: {
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
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['shoes', 'watches', 'clothes'],
  },
  brand: String,
  tags: [String],
  sizes: [String],
  colors: [String],
}, {timestamps: true})

module.exports = mongoose.model('Product', Product)
