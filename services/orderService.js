const Order = require('../models/Order')
const tempOrderService = require('../services/tempOrderService')
const productService = require('../services/productService')
const cartService = require('../services/cartService')
const {generateOrderNumber} = require('../utils/generateOrderNumber')

const completeOrder = async ({uid, orderId, name, contactNumber, address, orderNumber = ''}) => {
  const tempOrder = await tempOrderService.getTempOrder(uid, orderId)

  const order = new Order({products: tempOrder, uid, orderDate: new Date(), name, contactNumber, address})
  if (orderNumber) order.orderNumber = orderNumber

  await productService.updateProductSaleCount(tempOrder)
  await cartService.deleteCartProduct(
    uid,
    tempOrder.map((v) => v.product._id)
  )
  await order.save()
  await tempOrderService.deleteTempOrder(uid, orderId)
}

const findUniqueOrderNumber = async () => {
  let isUnique = false
  let orderNumber

  while (!isUnique) {
    orderNumber = generateOrderNumber()
    const order = await Order.findOne({orderNumber})
    if (!order) {
      isUnique = true
    }
  }
  return orderNumber
}

const getOrderList = async (uid, page = 1) => {
  const limit = 5
  const skip = (page - 1) * limit
  const orderList = await Order.find({uid}).sort({orderDate: -1}).skip(skip).limit(limit).populate({path: 'products.product'})
  return orderList
}

const getGuestOrderList = async (orderNumber, contactNumber) => {
  const orderList = await Order.findOne({orderNumber, contactNumber}).populate({path: 'products.product'})
  return orderList
}

const getRecentOrderList = async (uid) => {
  const recentDate = new Date()
  recentDate.setMonth(recentDate.getMonth() - 3)
  const orderList = await Order.find({uid, orderDate: {$gte: recentDate}})
    .sort({orderDate: -1})
    .limit(3)
    .populate({path: 'products.product'})
  const products = orderList.flatMap((order) => [...order.products])

  return products.slice(0, 3)
}

module.exports = {
  completeOrder,
  getOrderList,
  findUniqueOrderNumber,
  getGuestOrderList,
  getRecentOrderList,
}
