const router = require('express').Router()
const controller = require('../controllers/tempOrderController')

router.post('/:uid', controller.postTempOrder)

router.get('/:uid', controller.getTempOrder)

module.exports = router
