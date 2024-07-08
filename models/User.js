const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/,
  },
  account: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z][a-zA-Z0-9]{4,15}$/,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  orderCount: {
    type: Number,
    default: 0,
  },
})

userSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
