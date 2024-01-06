const express = require('express'),
    router = express.Router(),
    verify = require('../middleware/verify.jwt'),
    clothings = require('../controllers/clothings.controller')

router.use(verify) //authentication configuration

//basic routing 
router.route('/')
    .get(clothings.show)
    .post(clothings.create)
    .patch(clothings.update)
    .delete(clothings.deleteAll)

//special routes
router.route('/:id')
    .get(clothings.index)
    .delete(clothings.deleteOne)

module.exports = router