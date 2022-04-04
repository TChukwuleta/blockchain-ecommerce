const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    id: String,
    itemId: String,
    paid: Boolean
})

const Payment = mongoose.model('payment', paymentSchema)

module.exports = {
    Payment
}