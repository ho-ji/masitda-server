const service = require('../services/cartService')
const {getExpiresAt} = require('../utils/getExpiresAt')

const postCart = async (req, res) => {
  const uid = req.params.uid
  const {productId, count} = req.body
  const isLogIn = !uid.startsWith('guest')

  try {
    if (isLogIn) {
      await service.addToCart({uid, productId, count})
      return res.status(200).json({success: true, accessToken: req.accessToken, message: 'Product added to cart'})
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

  try {
    if (isLogIn) {
      let cart = await service.getCartProductByUid(uid)
      if (!cart) {
        cart = await service.createCartByUid(uid)
      }
      return res.status(200).json({success: true, accessToken: req.accessToken, products: cart.products, message: 'Successfully get Cart List'})
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

  try {
    if (isLogIn) {
      await service.deleteCartProduct(uid, idList)
      return res.status(200).json({success: true, accessToken: req.accessToken, message: 'Cart product deleted'})
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
