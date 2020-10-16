const mongoose = require('mongoose')

const targetSchema = new mongoose.Schema({
    url: { type: String },
    value: { type: String },
    maxAcceptsPerDay: { type: Number },
    accept: {
        geoState: { type: Array },
        hour: { type: Array }
    }
})

module.exports = mongoose.model('target', targetSchema)