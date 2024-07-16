const servie = require('../services/productService')

const getProductRanking = async (req, res) => {
  const limit = parseInt(req.query.limit) || 50

  try {
    const ranking = await servie.getProductRankingList(limit)
    res.status(200).json(ranking)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Ranking Not Found',
    })
  }
}

module.exports = {
  getProductRanking,
}
