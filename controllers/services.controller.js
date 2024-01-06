const Service = require('../models/service.model'),
    utilities = require('../utilities/utility.util'),
    moment = require('moment')

// @desc Get single service
// @route GET /services/:id
// @access Private
const index = async(req, res) =>{
    if(!req.params.id) return res.status(400).json({ message: `Please provide service's ID`, data: []}) 
    
    //get service's records
    const service = await Service.findById(req.params.id).lean().exec()

    if(!service) return res.status(400).json({ message: `There are no service data found`, data: []})

    res.json({ message: `Service data retrieved successfully`, data: service })
}

// @desc Get all services
// @route GET /services
// @access Private
const show = async(req, res) =>{
    const services = await Service.find().lean().exec()

    if(!services?.length) return res.status(400).json({ message: `There are no service data found!`})

    res.json({ message: `Categories data retrieved successfully`, data: services })
}

// @desc create new service
// @route POST /services
// @access Private
const create = async(req, res) =>{
    const { name, price, type, description } = req.body

    //confirm data
    if(!name || !price || !type || !description) return res.status(400).json({ message: 'All Fields are required', data: [] })

    //check for duplicate
    const duplicate = await Service.findOne({ name }).collation({ locale: 'en', strength: 2}).exec()
    if(duplicate) return res.status(409).json({ message: `Service already exist`, data: [] })

    const image = req?.files?.image,
        imagepath = `${global?.images}/services/${image?.name}`

    //move the image to the upload folder 
    image?.mv(imagepath)

    let serviceid = '', duplicateid = false
    while(!serviceid || duplicateid){
        serviceid = `SER/${moment(Date.now()).format('YYYY')}/${moment(Date.now()).format('M')}/${utilities.uniqueNumber(4)}`
        duplicateid = await Service.findOne({ serviceid }).collation({ locale: 'en', strength: 2}).exec()
    }
    
    //create and store new service
    const service = await Service.create({ serviceid, name, price, description, imageUrl: image?.name,})
    if(service){//service created
       return res.status(201).json({ message: `New service data has been created successfully`, data: service })
    }
    res.status(400).json({ message: 'Invalid service data provided', data: [] })
}

// @desc update a service
// @route PATCH /services
// @access Private
const update = async(req, res) =>{
    const { id, name, price, type, description } = req.body

    //confirm data
    if(!id || !name || !price || !type || description) return res.status(400).json({ message: 'All Fields are required', data: [] }) 

    //confirm service
    const service = await Service.findById(id).exec()
    if(!service) return res.status(400).json({ message: `Service record was not found`, data: [] })

    //check for duplicate
    const duplicate = await Service.findOne({ name }).collation({ locale: 'en', strength: 2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) return res.status(409).json({ message: `Service already exist`, data: [] })

    const image = req?.files
    if(image){
        imagepath = `${global?.images}/services/${image?.name}`
        //move the image to the upload folder 
        image?.move(imagepath)
    }
    
    service.name = name
    service.price = price
    service.type = type
    service.description = description
    image && (service.image = image.name)
    service.updatedAt = Date.now()
    await service.save()
    
    res.json({ message: `Service record have been updated successfully`, data: service })
}

// @desc delete a service Record
// @route DELETE /service/:id
// @access Private
const deleteOne = async(req, res) =>{
    const { id } = req.params

    //confirm data
    if(!id) return res.status(400).json({ message: `Provide service id`, data: [] })

    //confirm service
    const service = await Service.findById(id).exec()
    if(!service) return res.status(400).json({ message: `Service records not found`, data: [] })

    await service.deleteOne()

    res.json({ message: `Service record has been deleted successfully`, data: [] })
}

// @desc delete all service Record
// @route DELETE /services
// @access Private
const deleteAll = async(req, res) =>{
    await Service.deleteMany()

    res.json({ message: `Service records have been deleted successfully`, data: [] })
}

module.exports = {
    index,
    show,
    create,
    update,
    deleteOne,
    deleteAll
}