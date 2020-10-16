const express = require('express')
const router = express.Router()
const Target = require('../models/target')

router.post('/route', async function (req, res, next) {
    try {
        const { geoState, timestamp } = req.body
        const hour = new Date(timestamp).getHours()
        // Get Matched Targets of geostate and hour
        const targets = await Target.find({
            "accept.geoState": { $in: geoState },
            "accept.hour": { $in: hour }
        })
        console.log('targets---', targets, 'request', req.body, 'hour', hour)
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

module.exports = router
