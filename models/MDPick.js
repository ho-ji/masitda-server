const mongoose = require('mongoose')

const mdPickSchema = new mongoose.Schema(
  {
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    reason: {type: String},
  },
  {
    versionKey: false,
  }
)

const MDPick = mongoose.model('MDPick', mdPickSchema)

module.exports = MDPick
