const URL = require('url')
const cuid = require('cuid')
const sendJson = require('send-data/json')
const ReqLogger = require('req-logger')
const healthPoint = require('healthpoint')
const redis = require('../lib/redis')
const version = require('../package.json').version
const logger = ReqLogger({ version: version })
const health = healthPoint({ version: version }, redis.healthCheck)

exports.handler = async function (req, res) {
    if (req.url === '/health') return health(req, res)
    req.id = cuid()
    logger(req, res, { requestId: req.id }, function (info) {
        info.authEmail = (req.auth || {}).email
        console.log(info)
    })
    router(req, res, { query: getQuery(req.url) }, onError.bind(null, req, res))
}

function onError(req, res, err) {
    if (!err) return

    res.statusCode = err.statusCode || 500
    logError(req, res, err)

    sendJson(req, res, {
        error: err.message || http.STATUS_CODES[res.statusCode]
    })
}

function logError(req, res, err) {
    if (process.env.NODE_ENV === 'test') return

    const logType = res.statusCode >= 500 ? 'error' : 'warn'

    console[logType]({
        err: err,
        requestId: req.id,
        statusCode: res.statusCode
    }, err.message)
}

function getQuery(url) {
    return URL.parse(url, true).query // eslint-disable-line
}
