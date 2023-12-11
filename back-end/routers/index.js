
const express = require('express'),
    router = express.Router(),
    register = require('./user.router')
    newProfile = require('./profile.router')
    Category = require('./category.router')
    notif = require('./notification.router')

router.use('/profile', newProfile)
router.use('/auth', register);
router.use('/category', Category)
router.use('/notification', notif)

module.exports = router