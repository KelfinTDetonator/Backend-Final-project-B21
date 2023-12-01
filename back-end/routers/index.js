const express = require('express'),
    router = express.Router(),
    register = require('./user.router')
    newProfile = require('./profile.router')

router.use('/profile', newProfile)
router.use('/auth', register);

module.exports = router