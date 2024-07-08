const router = require('express').Router()
const controller = require('../controllers/passwordResetController')

router.get('/:token', controller.verifyResetToken)

module.exports = router
