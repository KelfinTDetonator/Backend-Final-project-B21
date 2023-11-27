const express = require('express'),
    router = express.Router(),
    categoryRouter = require('./category.router')

router.use(categoryRouter)

module.exports = router