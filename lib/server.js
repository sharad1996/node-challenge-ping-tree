const http = require('http')
const Corsify = require('corsify')
const HttpHashRouter = require('http-hash-router')

const app = require('../app')

const router = HttpHashRouter()
const cors = Corsify({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, accept, content-type'
})

router.set('/favicon.ico', empty)

module.exports = function createServer() {
  return http.createServer(cors(app))
}

function empty(req, res) {
  res.writeHead(204)
  res.end()
}
