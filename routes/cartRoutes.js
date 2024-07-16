const router = require('express').Router()
const controller = require('../controllers/cartController')
const authMiddleware = require('../middlewares/auth')

router.post('/:uid', authMiddleware, controller.postCart)

router.get('/:uid', authMiddleware, controller.getCart)

router.delete('/:uid', authMiddleware, controller.deleteCart)

module.exports = router
