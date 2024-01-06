const Product = require('../models/product.model'),
    utilities = require('../utilities/utility.util'),
    moment = require('moment')

// @desc Get single product
// @route GET /products/:id
// @access Private
const index = async(req, res) =>{
    if(!req.params.id) return res.status(400).json({ message: `Please provide product's ID`, data: []}) 
    
    //get product's records
    const product = await Product.findById(req.params.id).lean().exec()

    if(!product) return res.status(400).json({ message: `There are no product data found`, data: []})

    res.json({ message: `Product data retrieved successfully`, data: product })
}

// @desc Get all products
// @route GET /products
// @access Private
const show = async(req, res) =>{
    const products = await Product.find().lean().exec()

    if(!products?.length) return res.status(400).json({ message: `There are no product data found!`})

    res.json({ message: `Categories data retrieved successfully`, data: products })
}

// @desc create new product
// @route POST /products
// @access Private
const create = async(req, res) =>{
    const { name, price, category, description, brand, tags, sizes, colors } = req.body

    //confirm data
    if(!name || !price || !category || !description) return res.status(400).json({ message: 'All Fields are required', data: [] })

    //check for duplicate
    const duplicate = await Product.findOne({ name }).collation({ locale: 'en', strength: 2}).exec()
    if(duplicate) return res.status(409).json({ message: `Product already exist`, data: [] })

    const image = req?.files?.image,
        imagepath = `${global?.images}/products/${image?.name}`

    //move the image to the upload folder 
    image?.mv(imagepath)

    let productid = '', duplicateid = false
    while(!productid || duplicateid){
        productid = `PRO/${moment(Date.now()).format('YYYY')}/${moment(Date.now()).format('M')}/${utilities.uniqueNumber(4)}`
        duplicateid = await Product.findOne({ productid }).collation({ locale: 'en', strength: 2}).exec()
    }
    
    //create and store new product
    const product = await Product.create({ productid, name, price, quantity, description, imageUrl: image?.name, category, brand, tags, sizes, colors })
    if(product){//product created
       return res.status(201).json({ message: `New product data has been created successfully`, data: product })
    }
    res.status(400).json({ message: 'Invalid product data provided', data: [] })
}

// @desc update a product
// @route PATCH /products
// @access Private
const update = async(req, res) =>{
    const { id, name, price, category, description, brand, tags, sizes, colors } = req.body

    //confirm data
    if(!id || !name || !price || !category || !description) return res.status(400).json({ message: 'All Fields are required', data: [] }) 

    //confirm product
    const product = await Product.findById(id).exec()
    if(!product) return res.status(400).json({ message: `Product record was not found`, data: [] })

    //check for duplicate
    const duplicate = await Product.findOne({ name }).collation({ locale: 'en', strength: 2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) return res.status(409).json({ message: `Product already exist`, data: [] })

    const image = req?.files
    if(image){
        imagepath = `${global?.images}/products/${image?.name}`
        //move the image to the upload folder 
        image?.move(imagepath)
    }
    
    product.name = name
    product.price = price
    product.category = category
    product.description = description
    image && (product.image = image.name)
    product.brand = brand
    product.sizes = sizes
    product.tags = tags
    product.colors = colors
    product.updatedAt = Date.now()
    await product.save()
    
    res.json({ message: `Product record have been updated successfully`, data: product })
}

// @desc delete a product Record
// @route DELETE /product/:id
// @access Private
const deleteOne = async(req, res) =>{
    const { id } = req.params

    //confirm data
    if(!id) return res.status(400).json({ message: `Provide product id`, data: [] })

    //confirm product
    const product = await Product.findById(id).exec()
    if(!product) return res.status(400).json({ message: `Product records not found`, data: [] })

    await product.deleteOne()

    res.json({ message: `Product record has been deleted successfully`, data: [] })
}

// @desc delete all product Record
// @route DELETE /products
// @access Private
const deleteAll = async(req, res) =>{
    await Product.deleteMany()

    res.json({ message: `Product records have been deleted successfully`, data: [] })
}

module.exports = {
    index,
    show,
    create,
    update,
    deleteOne,
    deleteAll
}