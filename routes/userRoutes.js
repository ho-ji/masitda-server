const router = require('express').Router()
const controller = require('../controllers/userController')
const authMiddleware = require('../middlewares/auth')

router.post('/signup', controller.postUserSignUp)

router.get('/check/:account', controller.getUserCheckAccount)

router.post('/login/:uid', controller.postUserLogIn)

router.get('/information/:uid', authMiddleware, controller.getUserInformation)

router.delete('/logout/:uid', controller.deleteUserLogOut)

router.post('/password/:uid', authMiddleware, controller.postVerifyPassword)

router.get('/modify/:uid', authMiddleware, controller.getModifyUser)

router.post('/modify/:uid', authMiddleware, controller.postModifyUser)

router.get('/findAccount', controller.getFindAccount)

router.get('/findPassword', controller.getFindPassword)

router.post('/passwordChange', controller.postPasswordChange)

module.exports = router
