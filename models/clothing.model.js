const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Clothing = new Schema({
        clothingid: {
            type: String,
            required: [true, `Clothing must have a clothing id`],
            unique: [true, 'Clothing must be unique'],
        },
        name: {
            type: String,
            required: [true, 'Name of clothing is required']
        },
        description: {
            type: String,
        },
        category: {
            type: String,
            required: true,
        },
        color: {
            type: [String],
            required: true,
        },
        style: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    }, {timestamps: true})

module.exports = mongoose.model('Clothing', Clothing)