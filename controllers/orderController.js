const service = require('../services/orderService')
const userService = require('../services/userService')

const postOrder = async (req, res) => {
  const uid = req.params.uid
  const {orderId, name, contactNumber, address} = req.body
  const isLogIn = !uid.startsWith('guest')

  try {
    if (isLogIn) {
      await service.completeOrder({uid, orderId, name, contactNumber, address})
      const postResult = await userService.postUserOrderCount(uid)
      if (!postResult.success) return postResult
      return res.status(200).json({success: true, accessToken: req.accessToken, message: 'Order Complete'})
    }
    const orderNumber = await service.findUniqueOrderNumber()
    await service.completeOrder({uid, orderId, name, contactNumber, address, orderNumber})
    return res.status(200).json({success: true, orderNumber, message: 'Order Complete'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Fail to Order'})
  }
}

const getOrder = async (req, res) => {
  const uid = req.params.uid
  const isLogIn = !uid.startsWith('guest')
  const page = parseInt(req.query.page)

  try {
    if (!isLogIn) return res.status(200).json({success: false, message: 'No Login'})
    const orderList = await service.getOrderList(uid, page)
    return res.status(200).json({success: true, accessToken: req.accessToken, orderList, message: 'Successfully get order list'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Fail to load order list'})
  }
}
const getGuestOrder = async (req, res) => {
  const {orderNumber, contactNumber} = req.query

  try {
    const orderList = await service.getGuestOrderList(orderNumber, contactNumber)
    if (!orderList || orderList.length === 0) return res.status(200).json({success: false, message: 'No Guest Order'})
    res.status(200).json({success: true, orderList, message: 'Successfully get guest order list'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Fail to find guest order list'})
  }
}

const getRecentOrder = async (req, res) => {
  const uid = req.params.uid
  const isLogIn = !uid.startsWith('guest')

  try {
    if (!isLogIn) return res.status(200).json({success: false, message: 'No Login'})
    const orderList = await service.getRecentOrderList(uid)
    return res.status(200).json({success: true, accessToken: req.accessToken, orderList, message: ' Successfully get recent order list'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Fail to load order list'})
  }
}

module.exports = {
  postOrder,
  getOrder,
  getGuestOrder,
  getRecentOrder,
}
