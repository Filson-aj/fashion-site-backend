const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CustomTypes = mongoose.SchemaTypes,
    Measurement = new Schema({
        measurementid: {
            type: String,
            required: [true, `Measurement must have a measurement id`],
            unique: [true, 'Measurement must be unique'],
        },
        bustSize: {
            type: Number,
        },
        waistSize: {
            type: Number,
        },
        hipSize: {
            type: Number,
        },
        inseam: {
            type: Number,
        },
        sleeveLength: {
            type: Number,
        },
        customer: {
            type: CustomTypes.ObjectId,
            ref: 'Customer',
            required: [true, 'Measurement must belong to a customer'],
        },
    })

module.exports = mongoose.model('Measurement', Measurement)