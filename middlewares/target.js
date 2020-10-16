const redis = require('../lib/redis')

exports.isCached = (req, res, next) => {
    const { id } = req.params
    //First check in Redis
    redis.get(id, (err, data) => {
        if (err) {
            console.log(err)
        }
        if (data) {
            const reponse = JSON.parse(data)
            return res.status(200).json(reponse)
        }
        next()
    })
}

