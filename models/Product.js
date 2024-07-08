const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    salesCount: {type: Number, required: true},
    name: {type: String, required: true},
    description: {type: String},
    image: {type: String},
    cost: {type: Number, required: true},
    rate: {type: Number, default: 0},
    temp: {type: String, required: true},
  },
  {
    versionKey: false,
  }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product
