const express = require('express'),
    router = express.Router(),
    adminRouter = require('./admin.router')

router.use('/admin', adminRouter)

module.exports = router