const mongoose = require('mongoose')

const passwordResetSchema = new mongoose.Schema(
  {
    uid: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    passwordResetToken: {type: String, required: true},
    expiresAt: {type: Date, default: () => new Date(), index: {expires: '10m'}},
  },
  {
    versionKey: false,
  }
)

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema)

module.exports = PasswordReset
