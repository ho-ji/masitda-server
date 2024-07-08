const router = require('express').Router()
const controller = require('../controllers/productController')

router.get('/ranking', controller.getProductRanking)

module.exports = router
