const router = require('express').Router()
const controller = require('../controllers/mdPickController')

router.get('/', controller.getMDPick)

module.exports = router
