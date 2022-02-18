const mongo = require('mongoose')

const tokenSchema = mongo.Schema({
    code: String,
    userCode: String,
    price: Number,
    expiryDate: Date,
    issueDate: {
        type: Date, 
        default: Date.now()
    }
})

module.exports = mongo.model('token', tokenSchema)