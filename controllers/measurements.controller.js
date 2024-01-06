const Measurement = require('../models/measurement.model'),
    Customer = require('../models/customer.model'),
    utilities = require('../utilities/utility.util'),
    moment = require('moment')

// @desc Get single measurement
// @route GET /measurements/:id
// @access Private
const index = async(req, res) =>{
    if(!req.params.id) return res.status(400).json({ message: `Please provide measurement's ID`, data: []}) 
    
    //get measurement's records
    const measurement = await Measurement.findById(req.params.id).populate('user', 'customerid name gender contact').lean().exec()

    if(!measurement) return res.status(400).json({ message: `There are no measurement data found`, data: []})

    res.json({ message: `Measurement data retrieved successfully`, data: measurement })
}

// @desc Get all measurements
// @route GET /measurements
// @access Private
const show = async(req, res) =>{
    const measurements = await Measurement.find().populate('user', 'customerid name gender contact').lean().exec()

    if(!measurements?.length) return res.status(400).json({ message: `There are no measurements data found!`})

    res.json({ message: `Measurement data retrieved successfully`, data: measurements })
}

// @desc create new measurement
// @route POST /measurements
// @access Private
const create = async(req, res) =>{
    const { bustSize, waistSize, hipSize, inseam, sleeveLength, customerid } = req.body


    //confirm data
    if(!customerid) return res.status(400).json({ message: 'Customer ID Field is required', data: [] })

    //make sure that customer exist
    const customer = await Customer.findOne(customerid).lean().exec()
    if(!customer) return res.status(400).json({ message: 'Customer record not found', data: [] })

    let measurementid = '', duplicate = false
    while(!measurementid || duplicate){
        measurementid = `MSR/${moment(Date.now()).format('YYYY')}/${moment(Date.now()).format('M')}/${utilities.uniqueNumber(4)}`
        duplicate = await Measurement.findOne({ measurementid }).collation({ locale: 'en', strength: 2}).exec()
    }

    //create and store new measurement
    const measurement = await Measurement.create({ measurementid, bustSize, waistSize, hipSize, inseam, sleeveLength, customer: customer?._id })
    if(measurement){//measurement created
        return res.status(201).json({ message: `New measurement data has been created successfully`, data: measurement })
    }
    res.status(400).json({ message: 'Invalid measurement data provided', data: [] })
}

// @desc update a measurement
// @route PATCH /measurements
// @access Private
const update = async(req, res) =>{
    const { id, bustSize, waistSize, hipSize, inseam, sleeveLength } = req.body

    //confirm data
    if(!id) return res.status(400).json({ message: 'Measurent Id not are required', data: []}) 

    //confirm measurement
    const measurement = await Measurement.findById(id).exec()
    if(!measurement) return res.status(400).json({ message: `Measurement record was not found`, data: [] })
    
    bustSize && (measurement.bustSize = bustSize)
    waistSize && (measurement.waistSize = waistSize)
    hipSize &&  (measurement.hipSize = hipSize)
    inseam && (measurement.inseam = inseam)
   sleeveLength && ( measurement.sleeveLength = sleeveLength)
    measurement.updatedAt = Date.now()
    await measurement.save()
    
    res.json({ message: `Measurement record have been updated successfully`, data: measurement })
}

// @desc delete a measurement Record
// @route DELETE /measurement/:id
// @access Private
const deleteOne = async(req, res) =>{
    const { id } = req.params

    //confirm data
    if(!id) return res.status(400).json({ message: `Provide measurement id`, data: [] })

    //confirm measurement
    const measurement = await Measurement.findById(id).exec()
    if(!measurement) return res.status(400).json({ message: `Measurement records not found`, data: [] })

    const category = measurement.category

    await measurement.deleteOne()

    const cat = await Category.findById(category).lean().exec()
    if(cat){
        cat.quantity = cat.quantity - 1
        await cat.save()
        res.json({ message: `Measurement record has been deleted successfully`, data: [] })
    }else{
        res.json({ message: `Measurement record has been deleted successfully`, data: [] })
    }
}

// @desc delete all measurement Record
// @route DELETE /measurements
// @access Private
const deleteAll = async(req, res) =>{
    await Measurement.deleteMany()

    res.json({ message: `Measurement records have been deleted successfully`, data: [] })
}

module.exports = {
    index,
    show,
    create,
    update,
    deleteOne,
    deleteAll
}