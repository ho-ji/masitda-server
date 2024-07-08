const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  count: {type: Number, default: 0},
})
const cartSchema = new mongoose.Schema({
  uid: {type: String, required: true},
  products: [cartItemSchema],
  expiresAt: {type: Date, default: null, index: {expires: '0s'}},
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
