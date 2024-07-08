const Cart = require('../models/Cart')

const getCartByUid = async (uid) => {
  return await Cart.findOne({uid})
}

const getCartProductByUid = async (uid) => {
  return await Cart.findOne({uid}).populate({path: 'products.product'})
}

const createCartByUid = async (uid, expiresAt = null) => {
  const cart = new Cart({uid: uid, products: [], expiresAt})
  await cart.save()
  return cart
}

const updateCart = async (cart) => {
  await cart.save()
}

const deleteCart = async (uid) => {
  await Cart.deleteOne({uid})
}

const addToCart = async ({uid, productId, count, expiresAt = null}) => {
  let cart = await getCartByUid(uid)
  if (!cart) cart = await createCartByUid(uid, expiresAt)
  const index = cart.products.findIndex((item) => item.product.toString() === productId.toString())
  if (index !== -1) {
    cart.products[index].count += parseInt(count)
  } else {
    cart.products.push({product: productId, count: parseInt(count)})
  }
  if (expiresAt) cart.expiresAt = expiresAt
  await updateCart(cart)
}

const deleteCartProduct = async (uid, idList) => {
  let cart = await getCartByUid(uid)
  if (cart) {
    for (const idItem of idList) {
      cart.products = cart.products.filter((item) => item.product._id.toString() !== idItem.toString())
    }
    await updateCart(cart)
  }
}

const updateUserCart = async (guestUid, uid) => {
  const guestCart = await getCartByUid(guestUid)
  if (!guestCart) return
  let cart = await getCartByUid(uid)
  if (!cart) {
    cart = await createCartByUid(uid)
    cart.products = guestCart.products
  } else {
    const userProducts = cart.products
    for (const product of guestCart.products) {
      const findProduct = userProducts.find((item) => item.product.equals(product.product))
      if (findProduct) findProduct.count += product.count
      else userProducts.push(product)
    }
    cart.products = userProducts
  }
  await cart.save()
  await deleteCart(guestUid)
}

module.exports = {
  getCartByUid,
  getCartProductByUid,
  createCartByUid,
  updateCart,
  deleteCart,
  addToCart,
  deleteCartProduct,
  updateUserCart,
}
