const Clothing = require('../models/clothing.model'),
    utilities = require('../utilities/utility.util'),
    moment = require('moment')

// @desc Get single clothing
// @route GET /clothings/:id
// @access Private
const index = async(req, res) =>{
    if(!req.params.id) return res.status(400).json({ message: `Please provide clothing's ID`, data: []}) 
    
    //get clothing's records
    const clothing = await Clothing.findById(req.params.id).lean().exec()

    if(!clothing) return res.status(400).json({ message: `There are no clothing data found`, data: []})

    res.json({ message: `Clothing data retrieved successfully`, data: clothing })
}

// @desc Get all clothings
// @route GET /clothings
// @access Private
const show = async(req, res) =>{
    const clothings = await Clothing.find().lean().exec()

    if(!clothings?.length) return res.status(400).json({ message: `There are no clothing data found!`})

    res.json({ message: `Clothings data retrieved successfully`, data: clothings })
}

// @desc create new clothing
// @route POST /clothings
// @access Private
const create = async(req, res) =>{
    const { name, description, category, color, style, price, } = req.body

    //confirm data
    if(!name || !category || !color || !style || !price) return res.status(400).json({ message: 'All Fields are required except description', data: [] })

    //check for duplicate
    const duplicate = await Clothing.findOne({ name }).collation({ locale: 'en', strength: 2}).exec()
    if(duplicate) return res.status(409).json({ message: `Clothing already exist`, data: [] })

    const image = req?.files?.image,
        imagepath = `${global?.images}/uploads/${image?.name}`

    //move the image to the upload folder 
    image?.mv(imagepath)

    let clothingid = '', duplicateid = false
    while(!clothingid || duplicateid){
        clothingid = `CLT/${moment(Date.now()).format('YYYY')}/${moment(Date.now()).format('M')}/${utilities.uniqueNumber(4)}`
        duplicateid = await Clothing.findOne({ clothingid }).collation({ locale: 'en', strength: 2}).exec()
    }
    
    //create and store new clothing
    const clothing = await Clothing.create({ clothingid, name, description, category, color, style, price, image: image?.name })
    if(clothing){//clothing created
       return res.status(201).json({ message: `New clothing data has been created successfully`, data: clothing })
    }
    res.status(400).json({ message: 'Invalid clothing data provided', data: [] })
}

// @desc update a clothing
// @route PATCH /clothings
// @access Private
const update = async(req, res) =>{
    const { id, name, description, category, color, style, price } = req.body

    //confirm data
    if(!id || !name || !category || !color || !style || !price) return res.status(400).json({ message: 'All Fields are required except description', data: [] }) 

    //confirm clothing
    const clothing = await Clothing.findById(id).exec()
    if(!clothing) return res.status(400).json({ message: `Clothing record was not found`, data: [] })

    //check for duplicate
    const duplicate = await Clothing.findOne({ name }).collation({ locale: 'en', strength: 2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) return res.status(409).json({ message: `Clothing already exist`, data: [] })

    const image = req?.files
    if(image){
        imagepath = `${global?.images}/uploads/${image?.name}`
        //move the image to the upload folder 
        image?.move(imagepath)
    }
    
    clothing.name = name
    description && (clothing.description = description)
    clothing.category = category
    clothing.color = color
    clothing.style = style
    clothing.price = price
    image && (clothing.image = image.name)
    clothing.updatedAt = Date.now()
    await clothing.save()
    
    res.json({ message: `Clothing record have been updated successfully`, data: clothing })
}

// @desc delete a clothing Record
// @route DELETE /clothing/:id
// @access Private
const deleteOne = async(req, res) =>{
    const { id } = req.params

    //confirm data
    if(!id) return res.status(400).json({ message: `Provide clothing id`, data: [] })

    //confirm clothing
    const clothing = await Clothing.findById(id).exec()
    if(!clothing) return res.status(400).json({ message: `Clothing records not found`, data: [] })

    await clothing.deleteOne()

    res.json({ message: `Clothing record has been deleted successfully`, data: [] })
}

// @desc delete all clothing Record
// @route DELETE /clothings
// @access Private
const deleteAll = async(req, res) =>{
    await Clothing.deleteMany()

    res.json({ message: `Clothing records have been deleted successfully`, data: [] })
}

module.exports = {
    index,
    show,
    create,
    update,
    deleteOne,
    deleteAll
}