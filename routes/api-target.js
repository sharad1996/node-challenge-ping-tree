var express = require('express')
var router = express.Router()
const services = require('../services/service-target')
const middleware = require('../middlewares/middleware-target')

router.get('/target/:id', middleware.isCached, services.getTarget)

router.get('/targets', services.getTargets)

router.post('/targets', services.addTarget)

router.post('/target/:id', services.updateTarget)

module.exports = router
