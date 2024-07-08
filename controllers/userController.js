const service = require('../services/userService')
const tokenService = require('../services/tokenService')
const cartService = require('../services/cartService')
const passwordResetService = require('../services/passwordResetService')
const {sendEmail} = require('../utils/sendEmail')

const postUserSignUp = async (req, res) => {
  const info = req.body.info
  try {
    const user = await service.getUserByAccount(info.account)
    if (user) {
      return res.status(200).json({
        success: false,
        message: 'User ID already exists',
      })
    }
    await service.signUpUser(info)
    res.status(201).json({success: true, message: 'User registered'})
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Fail to Signup',
    })
  }
}

const getUserCheckAccount = async (req, res) => {
  const {account} = req.params
  try {
    const user = await service.getUserByAccount(account)
    if (user) {
      return res.status(200).json({
        success: false,
        message: 'User ID already exists',
      })
    }
    res.status(200).json({
      success: true,
      message: 'User ID does not exist',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'User ID is not available',
    })
  }
}

const postUserLogIn = async (req, res) => {
  const uid = req.params.uid
  const {account, password} = req.body
  try {
    const user = await service.getUserByAccount(account)
    if (!user) return res.status(200).json({success: false, message: 'Invalid ID or password'})

    const successLogIn = await user.checkPassword(password)
    if (!successLogIn) return res.status(200).json({success: false, message: 'Invalid ID or password'})

    await cartService.updateUserCart(uid, user._id)

    const {accessToken, refreshToken} = await tokenService.createToken(user._id)
    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000})
    res.status(200).json({success: true, accessToken, uid: user._id, message: 'Login success'})
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Fail to Login',
    })
  }
}

const deleteUserLogOut = async (req, res) => {
  const uid = req.params.uid
  const refreshToken = req.cookies?.refreshToken
  try {
    await tokenService.deleteToken({uid, refreshToken})
    res.clearCookie('refreshToken', {httpOnly: true, secure: true})
    res.status(200).json({message: 'Logout success'})
  } catch (error) {
    console.error(error)
    res.clearCookie('refreshToken', {httpOnly: true, secure: true})
    res.status(500).json({
      message: 'Fail to Log out',
    })
  }
}

const getUserInformation = async (req, res) => {
  const uid = req.params.uid
  const accessToken = req.headers.authorization?.split('Bearer ')[1]
  const refreshToken = req.cookies?.refreshToken
  try {
    const result = await tokenService.verifyToken({uid, accessToken, refreshToken})
    if (!result.success) {
      return res.status(200).json(result)
    }
    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await tokenService.createToken(uid)
    const user = await service.getUserByUid(uid)
    if (!user) return res.status(200).json({success: false, message: 'User not found'})

    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
    return res.status(200).json({success: true, accessToken: newAccessToken, user: {name: user.name, orderCount: user.orderCount}, message: 'Successfully get user information'})
  } catch (error) {
    console.error(error)
    return res.status(200).json({success: false, message: 'Fail to Find User'})
  }
}

const getVerifyToken = async (req, res) => {
  const uid = req.params.uid
  const accessToken = req.headers.authorization?.split('Bearer ')[1]
  const refreshToken = req.cookies?.refreshToken
  try {
    const result = await tokenService.verifyToken({uid, accessToken, refreshToken})
    if (!result.success) {
      return res.status(200).json(result)
    }
    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await tokenService.createToken(uid)
    const user = await service.getUserByUid(uid)
    if (!user) return res.status(200).json({success: false, message: 'User not found'})

    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
    res.status(200).json({success: true, accessToken: newAccessToken, message: 'User is be logged in'})
  } catch (error) {
    res.status(200).json({success: false, message: 'No Log In'})
  }
}

const postVerifyPassword = async (req, res) => {
  const uid = req.params.uid
  const accessToken = req.headers.authorization?.split('Bearer ')[1]
  const refreshToken = req.cookies?.refreshToken
  const {password} = req.body
  try {
    const result = await tokenService.verifyToken({uid, accessToken, refreshToken})
    if (!result.success) {
      return res.status(200).json(result)
    }
    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await tokenService.createToken(uid)

    const user = await service.getUserByUid(uid)
    if (!user) return res.status(200).json({success: false, message: 'User not found'})

    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})

    const successLogIn = await user.checkPassword(password)
    if (!successLogIn) return res.status(200).json({success: false, message: 'Invalid password'})

    res.status(200).json({success: true, accessToken: newAccessToken, message: 'Correct password'})
  } catch (error) {
    res.status(200).json({success: false, message: 'Fail to verify password'})
  }
}

const getModifyUser = async (req, res) => {
  const uid = req.params.uid
  const accessToken = req.headers.authorization?.split('Bearer ')[1]
  const refreshToken = req.cookies?.refreshToken
  try {
    const result = await tokenService.verifyToken({uid, accessToken, refreshToken})
    if (!result.success) {
      return res.status(200).json(result)
    }
    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await tokenService.createToken(uid)
    const user = await service.getUserByUid(uid)
    if (!user) return res.status(200).json({success: false, message: 'User not found'})

    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: {name: user.name, phoneNumber: user.phoneNumber, account: user.account, email: user.email},
      message: 'Successfully get user information',
    })
  } catch (error) {
    console.error(error)
    return res.status(200).json({success: false, message: 'Fail to Find User'})
  }
}

const postModifyUser = async (req, res) => {
  const uid = req.params.uid
  const accessToken = req.headers.authorization?.split('Bearer ')[1]
  const refreshToken = req.cookies?.refreshToken
  const info = req.body.info
  try {
    const result = await tokenService.verifyToken({uid, accessToken, refreshToken})
    if (!result.success) {
      return res.status(200).json(result)
    }
    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await tokenService.createToken(uid)
    const user = await service.getUserByUid(uid)
    if (!user) return res.status(200).json({success: false, message: 'User not found'})

    Object.assign(user, info)

    await service.updateUser(user)

    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      success: 'Successfully update user information',
    })
  } catch (error) {
    console.error(error)
    return res.status(200).json({success: false, message: 'Fail to Modify User'})
  }
}

const getFindAccount = async (req, res) => {
  const {name, email} = req.query
  try {
    const user = await service.getUser({name, email})
    if (!user) return res.status(200).json({success: false, message: 'No User'})
    res.status(200).json({success: true, account: user.account, message: 'Successfully Find User Account'})
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: 'Fail to Find User Account'})
  }
}

const getFindPassword = async (req, res) => {
  const {email, account} = req.query
  try {
    const user = await service.getUser({email, account})
    if (!user) return res.status(200).json({success: false, message: 'No User'})

    const token = await passwordResetService.updateResetToken(user._id)
    sendEmail({name: user.name, email, token})

    res.status(200).json({success: true, uid: user.uid, message: 'User Exist'})
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: 'Fail to Find Password'})
  }
}

const postPasswordChange = async (req, res) => {
  const {uid, password} = req.body
  try {
    const user = await service.getUserByUid(uid)
    if (!user) return res.status(200).json({success: false, message: 'No User'})

    user.password = password
    await service.updateUser(user)

    await passwordResetService.deleteResetToken(uid)

    res.status(200).json({success: true, message: 'Successfully Change Password'})
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: 'Fail to Change Password'})
  }
}

module.exports = {
  postUserLogIn,
  deleteUserLogOut,
  postUserSignUp,
  getUserCheckAccount,
  getUserInformation,
  getVerifyToken,
  postVerifyPassword,
  getModifyUser,
  postModifyUser,
  getFindAccount,
  getFindPassword,
  postPasswordChange,
}
