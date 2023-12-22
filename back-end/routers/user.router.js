const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/user.controller'),
    checkRole = require('../middleware/checkRole'),
    checkToken = require('../middleware/checkToken')

router.delete('/:id',checkToken, checkRole(["admin","user"]), controller.deleteUser)
router.get('/',checkToken, checkRole(["admin", "user"]),controller.getAllUsers)
router.get('/:id', controller.getById)
router.post('/otp', controller.otp)
router.post('/verify', controller.verify)
router.post('/', controller.register)
router.post('/login', controller.login)
router.post('/forget-password', controller.forgetPassword)
router.post('/insert-password', controller.insertPassword)
router.post('/update-password',checkToken, checkRole(["admin", "user"]), controller.updatePassword)
router.post('/admin', controller.loginAdmin)

module.exports = router