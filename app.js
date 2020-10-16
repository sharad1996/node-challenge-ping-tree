const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

const targetRoutes = require('./routes/target')
const visitorRoutes = require('./routes/visitor')
const healthRoutes = require('./routes/health')
const connect = require('./dbconfig')

connect()
app.options('*', cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ extended: false }))

// api health routes
app.use('/health', healthRoutes)

// api target routes
app.use('/api', cors('*'), targetRoutes)

// visitor route
app.use('/api', cors('*'), visitorRoutes)

module.exports = app
