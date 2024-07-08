const service = require('../services/tempOrderService')
const tokenService = require('../services/tokenService')

const postTempOrder = async (req, res) => {
  const uid = req.params.uid
  const order = req.body.order
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
      const orderId = await service.processingOrder({uid, order})
      res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
      return res.status(200).json({success: true, accessToken: newAccessToken, orderId, message: 'Order in progress'})
    }
    const orderId = await service.processingOrder({uid, order})
    return res.status(200).json({success: true, orderId, message: 'Order in progress'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Order progress failed`'})
  }
}

const getTempOrder = async (req, res) => {
  const uid = req.params.uid
  const orderId = req.query.orderId
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
      const order = await service.getTempOrder(uid, orderId)
      res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
      if (!order) return res.status(200).json({success: false, accessToken: newAccessToken, message: 'Current Order is expired'})
      return res.status(200).json({success: true, accessToken: newAccessToken, order, message: ''})
    }
    const order = await service.getTempOrder(uid, orderId)
    if (!order) return res.status(200).json({success: false, message: 'Current Order is expired'})
    return res.status(200).json({success: true, order, message: ''})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Fail to load temp order list'})
  }
}

module.exports = {
  postTempOrder,
  getTempOrder,
}
