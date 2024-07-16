const service = require('../services/passwordResetService')

const verifyResetToken = async (req, res) => {
  const passwordResetToken = req.params.token

  try {
    const result = await service.getResetToken(passwordResetToken)
    if (!result) return res.status(200).json({success: false, message: 'Expired Reset Password'})
    res.status(200).json({success: true, message: 'Possible to change Password', uid: result.uid})
  } catch (error) {
    console.error(error)
    res.status(500).json({messgae: 'Fail to Reset Password'})
  }
}

module.exports = {
  verifyResetToken,
}
