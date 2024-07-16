const Token = require('../models/Token')
const jwt = require('jsonwebtoken')
const {verifyAccessToken} = require('../utils/token')

const createAccessToken = (uid) => {
  return jwt.sign({uid}, process.env.ACCESS_TOKEN_KEY, {expiresIn: '10m'})
}

const createRefreshToken = async (uid) => {
  const refreshToken = jwt.sign({uid}, process.env.REFRESH_TOKEN_KEY, {expiresIn: '7d'})
  const token = new Token({
    uid,
    refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })
  await token.save()
  return refreshToken
}

const deleteRefreshToken = async ({uid, refreshToken}) => {
  await Token.deleteOne({uid, refreshToken})
}

const verifyToken = async ({uid, accessToken, refreshToken}) => {
  const newAccessToken = createAccessToken(uid)

  if (!accessToken) {
    const {accessTokenValid, accessTokenError} = verifyAccessToken(accessToken, uid)

    if (accessTokenError) return {success: false, message: accessTokenError}

    if (accessTokenValid) return {success: true, accessToken: newAccessToken, refreshToken}
  }
  const token = Token.findOne({uid, refreshToken})

  if (!token) {
    return {success: false, message: 'Token Error'}
  }

  await deleteRefreshToken({uid, refreshToken})

  const currentTime = new Date()
  if (currentTime - token.expiresAt > 0) {
    return {success: false, message: 'Re-Login'}
  }

  const newRefreshToken = await createRefreshToken(uid)
  return {success: true, accessToken: newAccessToken, refreshToken: newRefreshToken}
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  deleteRefreshToken,
  verifyToken,
}
