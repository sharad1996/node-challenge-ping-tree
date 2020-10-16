const express = require('express')
const router = express.Router()
const services = require('../services/health')

router.get('/health', services.handler)

module.exports = router
