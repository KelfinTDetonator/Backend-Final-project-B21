const express = require('express'),
    router = express.Router(),
    categoryRouter = require('./category.router'),
    courseRouter = require('./course.router')

router.use(categoryRouter);
router.use('/course', courseRouter)

module.exports = router