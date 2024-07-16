const router = require('express').Router()
const controller = require('../controllers/orderController')
const authMiddleware = require('../middlewares/auth')

router.get('/guestOrder', controller.getGuestOrder)

router.get('/recent/:uid', authMiddleware, controller.getRecentOrder)

router.post('/:uid', authMiddleware, controller.postOrder)

router.get('/:uid', authMiddleware, controller.getOrder)

module.exports = router
