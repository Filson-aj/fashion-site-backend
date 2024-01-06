const express = require('express'),
    router = express.Router(),
    verify = require('../middleware/verify.jwt'),
    measurements = require('../controllers/measurements.controller')

router.use(verify) //authentication configuration

//basic routing 
router.route('/')
    .get(measurements.show)
    .post(measurements.create)
    .patch(measurements.update)
    .delete(measurements.deleteAll)

//special routes
router.route('/:id')
    .get(measurements.index)
    .delete(measurements.deleteOne)

module.exports = router