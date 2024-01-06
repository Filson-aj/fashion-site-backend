const mongoose = require('mongoose')

const Order = new mongoose.Schema({
    orderid: {
        type: String,
        required: [true, `Order must have a order id`],
        unique: [true, 'Order must be unique'],
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    items: [
        {
            clothing: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Clothing',
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
            },
            color: {
                type: String,
            },
        },
    ],
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending',
    },
    price: {
        type: Number,
        default: 0,
    },
}, {timestamps: true})

module.exports = mongoose.model('Order', Order)
