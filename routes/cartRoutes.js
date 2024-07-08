const router = require('express').Router()
const controller = require('../controllers/cartController')

router.post('/:uid', controller.postCart)

router.get('/:uid', controller.getCart)

router.delete('/:uid', controller.deleteCart)

module.exports = router
