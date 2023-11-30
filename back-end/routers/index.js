const express = require('express'),
    router = express.Router(),
    register = require('./user.router')
router.use('/auth', register);

module.exports = router