const PasswordReset = require('../models/PasswordReset')
const crypto = require('crypto')

const getResetToken = async (passwordResetToken) => {
  const result = await PasswordReset.findOne({passwordResetToken})
  return result
}

const updateResetToken = async (uid) => {
  const token = crypto.randomBytes(32).toString('hex')
  const passwordReset = new PasswordReset({uid, passwordResetToken: token})
  await passwordReset.save()
  return token
}

const deleteResetToken = async (uid) => {
  await PasswordReset.findOneAndDelete({uid})
}

module.exports = {
  getResetToken,
  updateResetToken,
  deleteResetToken,
}
