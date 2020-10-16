const express = require('express')
const router = express.Router()
const services = require('../services/target')
const middleware = require('../middlewares/target')

router.get('/target/:id', middleware.isCached, services.getTarget)

router.get('/targets', services.getTargets)

router.post('/targets', services.addTarget)

router.post('/target/:id', services.updateTarget)

module.exports = router
