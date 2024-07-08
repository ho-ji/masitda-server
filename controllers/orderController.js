const service = require('../services/orderService')
const userService = require('../services/userService')
const tokenService = require('../services/tokenService')

const postOrder = async (req, res) => {
  const uid = req.params.uid
  const {orderId, name, contactNumber, address} = req.body
  const isLogIn = !uid.startsWith('guest')
  const accessToken = req.headers.authorization?.split('Bearer ')[1]
  const refreshToken = req.cookies?.refreshToken
  try {
    if (isLogIn) {
      const result = await tokenService.verifyToken({uid, accessToken, refreshToken})
      if (!result.success) {
        return res.status(200).json(result)
      }
      const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await tokenService.createToken(uid)
      await service.completeOrder({uid, orderId, name, contactNumber, address})
      const postResult = await userService.postUserOrderCount(uid)
      if (!postResult.success) return postResult
      res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
      return res.status(200).json({success: true, accessToken: newAccessToken, message: 'Order Complete'})
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
  const accessToken = req.headers.authorization?.split('Bearer ')[1]
  const refreshToken = req.cookies?.refreshToken
  const page = parseInt(req.query.page)
  try {
    if (!isLogIn) return res.status(200).json({success: false, message: 'No Login'})
    const result = await tokenService.verifyToken({uid, accessToken, refreshToken})
    if (!result.success) {
      return res.status(200).json(result)
    }
    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await tokenService.createToken(uid)
    const orderList = await service.getOrderList(uid, page)
    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
    return res.status(200).json({success: true, accessToken: newAccessToken, orderList, message: 'Successfully get order list'})
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
  const accessToken = req.headers.authorization?.split('Bearer ')[1]
  const refreshToken = req.cookies?.refreshToken
  try {
    if (!isLogIn) return res.status(200).json({success: false, message: 'No Login'})
    const result = await tokenService.verifyToken({uid, accessToken, refreshToken})
    if (!result.success) {
      return res.status(200).json(result)
    }
    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await tokenService.createToken(uid)
    const orderList = await service.getRecentOrderList(uid)
    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
    return res.status(200).json({success: true, accessToken: newAccessToken, orderList, message: ' Successfully get recent order list'})
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
