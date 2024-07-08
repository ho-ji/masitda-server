const service = require('../services/cartService')
const tokenService = require('../services/tokenService')
const {getExpiresAt} = require('../utils/getExpiresAt')

const postCart = async (req, res) => {
  const uid = req.params.uid
  const {productId, count} = req.body
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
      await service.addToCart({uid, productId, count})
      res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
      return res.status(200).json({success: true, accessToken: newAccessToken, message: 'Product added to cart'})
    }
    const expiresAt = getExpiresAt()
    await service.addToCart({uid, productId, count, expiresAt})
    return res.status(200).json({success: true, message: 'Product added to cart'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Fail to add product to cart'})
  }
}

const getCart = async (req, res) => {
  const uid = req.params.uid
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
      let cart = await service.getCartProductByUid(uid)
      if (!cart) {
        cart = await service.createCartByUid(uid)
      }
      res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
      return res.status(200).json({success: true, accessToken: newAccessToken, products: cart.products, message: 'Successfully get Cart List'})
    }
    let cart = await service.getCartProductByUid(uid)
    if (!cart) {
      const expiresAt = getExpiresAt()
      cart = await service.createCartByUid(uid, expiresAt)
    }
    res.clearCookie('refreshToken', {httpOnly: true, secure: true})
    return res.status(200).json({success: true, products: cart.products, message: 'Successfully get Cart List'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Fail to load cart'})
  }
}

const deleteCart = async (req, res) => {
  const uid = req.params.uid
  const idList = req.body.productId
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
      await service.deleteCartProduct(uid, idList)
      res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
      return res.status(200).json({success: true, accessToken: newAccessToken, message: 'Cart product deleted'})
    }
    await service.deleteCartProduct(uid, idList)
    return res.status(200).json({success: true, message: 'Cart product deleted'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Fail to delete cart product'})
  }
}

module.exports = {
  postCart,
  getCart,
  deleteCart,
}
