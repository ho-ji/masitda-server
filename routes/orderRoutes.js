const router = require('express').Router()
const controller = require('../controllers/orderController')

router.get('/guestOrder', controller.getGuestOrder)

router.get('/recent/:uid', controller.getRecentOrder)

router.post('/:uid', controller.postOrder)

router.get('/:uid', controller.getOrder)

module.exports = router
