const Product = require('../models/Product')

const getProductRankingList = async (limit) => {
  return await Product.find({}).sort({salesCount: -1}).limit(limit)
}

const updateProductSaleCount = async (orders) => {
  for (const order of orders) {
    await Product.findByIdAndUpdate(order.product._id, {$inc: {salesCount: order.count}})
  }
}

module.exports = {
  getProductRankingList,
  updateProductSaleCount,
}
