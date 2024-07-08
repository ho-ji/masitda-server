const router = require('express').Router()
const controller = require('../controllers/userController')

router.post('/signup', controller.postUserSignUp)

router.get('/check/:account', controller.getUserCheckAccount)

router.post('/login/:uid', controller.postUserLogIn)

router.get('/information/:uid', controller.getUserInformation)

router.get('/login/:uid', controller.getVerifyToken)

router.delete('/logout/:uid', controller.deleteUserLogOut)

router.post('/password/:uid', controller.postVerifyPassword)

router.get('/modify/:uid', controller.getModifyUser)

router.post('/modify/:uid', controller.postModifyUser)

router.get('/findAccount', controller.getFindAccount)

router.get('/findPassword', controller.getFindPassword)

router.post('/passwordChange', controller.postPasswordChange)

module.exports = router
