const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const router = express.Router()
const app = express()

const Target = require('./models/target')
const targetRoutes = require('./routes/target')
const healthService = require('./services/health')
const connect = require('./dbconfig')

connect()
app.options('*', cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ extended: false }))

// api health routes
router.get('/health', healthService.handler)

// api target routes
app.use('/api', cors('*'), targetRoutes)

// visitor route
router.post('/route', async function (req, res, next) {
    try {
        const { geoState, timestamp } = req.body
        const hour = new Date(timestamp).getHours()
        // Get Matched Targets of geostate and hour
        const targets = await Target.find({
            "accept.geoState": { $in: geoState },
            "accept.hour": { $in: hour }
        })
        if (targets && targets.length) {
            // Get max value target from matched targets
            const target = targets.reduce((prev, current) => (prev.value > current.value) ? prev : current)
            res.status(200).json({ decision: target.url })
        } else {
            res.status(200).json({ decision: "reject" })
        }
    }
    catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

module.exports = app
