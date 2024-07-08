const mongoose = require('mongoose')

const tempOrderItemSchema = new mongoose.Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
  count: {type: Number, required: true},
  cost: {type: Number, required: true},
  rate: {type: Number, default: 0},
})

const tempOrderSchema = new mongoose.Schema({
  uid: {type: String, required: true},
  products: [tempOrderItemSchema],
  orderDate: {type: Date, default: Date.now},
  expiresAt: {type: Date, default: () => new Date(), index: {expires: '30m'}},
})

const TempOrder = mongoose.model('TempOrder', tempOrderSchema)

module.exports = TempOrder
