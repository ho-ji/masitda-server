const router = require('express').Router()
const controller = require('../controllers/tempOrderController')
const authMiddleware = require('../middlewares/auth')

router.post('/:uid', authMiddleware, controller.postTempOrder)

router.get('/:uid', authMiddleware, controller.getTempOrder)

module.exports = router
