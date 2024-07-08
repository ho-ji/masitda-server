const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
  uid: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  refreshToken: {type: String, required: true},
  expiresAt: {type: Date, required: true, index: {expires: '0s'}},
})

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token
