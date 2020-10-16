const Target = require('../models/target')
const redis = require('../lib/redis')

// Get Target By ID
exports.getTarget = async function (req, res, next) {
    try {
        const { id } = req.params
        const target = await Target.findById(id)
        res.status(200).json({ target })
    }
    catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

// Get all targets
exports.getTargets = async function (req, res, next) {
    try {
        const targets = await Target.find({})
        res.status(200).json({ targets })
    }
    catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

// Post Target
exports.addTarget = async function (req, res, next) {
    try {
        const payload = {
            url: req.body.url,
            value: req.body.value,
            maxAcceptsPerDay: req.body.maxAcceptsPerDay,
            accept: req.body.accept
        }
        const target = new Target({ ...payload })
        target.save()
        if (target) {
            //Store in Redis
            redis.setex(target.id, 60, JSON.stringify(target), (err, reply) => {
                if (err) {
                    console.log(err);
                }
                console.log(reply);
            });
            res.status(200).json(target)
        }
        else {
            res.status(400).json({ msg: 'add target successfully' })
        }
    }
    catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

// Update Target
exports.updateTarget = async function (req, res, next) {
    const payload = { url: req.body.url, value: req.body.value, maxAcceptsPerDay: req.body.maxAcceptsPerDay, accept: req.body.accept }
    try {
        await Target.updateOne({ id: payload.id }, { ...payload })
        res.status(200).json({ msg: 'updated target successfully' })
    }
    catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}
