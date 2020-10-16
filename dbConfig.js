const mongoose = require('mongoose')
const config = require('./config')

const mongoDbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}

let mongoUrl

if (config.dbHost && config.dbPort && config.dbName) {
    mongoUrl = process.env.dbHost + ':' + process.env.dbPort + '/' + process.env.dbName
}

const connect = () => {
    mongoose.connect(mongoUrl || 'mongodb://127.0.0.1:27017/pingtree',
        mongoDbOptions, (err) => {
            if (err) console.log(err)
            else console.log('MONGOOSE CONNECTED')
        })
}

module.exports = connect
