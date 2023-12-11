const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/notification.controller'),
    checkRole = require('../middleware/checkRole'),
    checkToken = require('../middleware/checkToken')

// router.get('/', controller.getAll),
// router.get('/:id',checkToken, checkRole(["admin", "user"]), controller.getId)
router.get('/', checkToken,controller.getByUserId)
router.delete('/:id', controller.delete)
// router.post('/',checkToken, controller.create)

module.exports = router