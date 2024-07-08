const jwt = require('jsonwebtoken')

const verifyAccessToken = function (accessToken, uid) {
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY)
    if (decoded.uid !== uid) return {accessTokenError: 'Token Error'}
    return {accessTokenValid: true}
  } catch (error) {
    return {accessTokenValid: false}
  }
}

module.exports = {
  verifyAccessToken,
}
