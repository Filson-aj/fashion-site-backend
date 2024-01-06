const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CustomTypes = mongoose.SchemaTypes,
    Outfit = new Schema({
        outfitid: {
            type: String,
            required: [true, `Outfit must have a outfit id`],
            unique: [true, 'Outfit must be unique'],
        },
        name: {
            type: String,
            required: [true, 'Name of outfit is required']
        },
        description: {
            type: String,
            required: true,
        },
        items: {
            type: [{type: CustomTypes.ObjectId, ref: 'Clothing'}],
        },
        styleSuggeston: {
            type: String,
        },
    })

module.exports = mongoose.model('Outfit', Outfit)