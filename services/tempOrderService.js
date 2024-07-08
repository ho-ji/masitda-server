const TempOrder = require('../models/TempOrder')

const processingOrder = async ({uid, order}) => {
  const tempOrder = new TempOrder({uid, products: order, orderDate: new Date()})
  const newTempOrder = await tempOrder.save()
  return newTempOrder._id
}

const getTempOrder = async (uid, orderId) => {
  const order = await TempOrder.findOne({uid, _id: orderId}).populate({path: 'products.product'})
  return order?.products
}

const deleteTempOrder = async (uid, orderId) => {
  await TempOrder.deleteOne({uid, _id: orderId})
}

module.exports = {
  processingOrder,
  getTempOrder,
  deleteTempOrder,
}
