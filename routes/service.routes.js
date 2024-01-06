const express = require('express'),
    router = express.Router(),
    verify = require('../middleware/verify.jwt'),
    services = require('../controllers/services.controller')

router.use(verify) //authentication configuration

//basic routing 
router.route('/')
    .get(services.show)
    .post(services.create)
    .patch(services.update)
    .delete(services.deleteAll)

//special routes
router.route('/:id')
    .get(services.index)
    .delete(services.deleteOne)

module.exports = router