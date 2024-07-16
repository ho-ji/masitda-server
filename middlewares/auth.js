const tokenService = require('../services/tokenService')

const authMiddleware = async (req, res, next) => {
  const uid = req.params.uid
  const isLogIn = !uid.startsWith('guest')
  const accessToken = req.headers.authorization?.split('Bearer ')[1]
  const refreshToken = req.cookies?.refreshToken

  if (!isLogIn) {
    return next()
  }

  try {
    const result = await tokenService.verifyToken({uid, accessToken, refreshToken})
    if (!result.success) {
      return res.status(401).json(result)
    }

    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = result
    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})

    req.accessToken = newAccessToken
    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Token Error'})
  }
}

module.exports = authMiddleware
