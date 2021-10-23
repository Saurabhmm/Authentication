const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/AuthController')

router.get('/getAllUsers',AuthController.index)
router.post('/register',AuthController.register)
router.post('/login',AuthController.login)

router.post('/adminLogin',AuthController.adminLogin)
router.post('/ownerLogin',AuthController.ownerLogin)

router.post('/userLogout',AuthController.userLogout)
router.post('/adminLogout',AuthController.adminLogout)
router.post('/ownerLogout',AuthController.ownerLogout)

router.post('/userForgetPassword',AuthController.userForgetPassword)
router.post('/adminForgetPassword',AuthController.adminForgetPassword)
router.post('/ownerForgetPassword',AuthController.ownerForgetPassword)



// ownerForgetPassword

module.exports = router