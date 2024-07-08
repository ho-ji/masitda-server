const MDPick = require('../models/MDPick')

const getMDPickProductList = async (limit) => {
  return await MDPick.find({}).populate('product').limit(limit)
}

module.exports = {
  getMDPickProductList,
}
