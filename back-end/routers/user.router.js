const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/user.controller')

// router.post('/', controller.postUser)
router.delete('/:id', controller.deleteUser)
router.get('/', controller.getAllUsers)
router.get('/:id', controller.getById)
router.post('/otp', controller.otp)
router.post('/verify', controller.verify)
router.post('/', controller.register)
router.post('/login', controller.login)

module.exports = router