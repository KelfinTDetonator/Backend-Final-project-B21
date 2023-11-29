const express = require('express'),
    router = express.Router(),
    register = require('./user.router')
router.use('/register', register);

module.exports = router