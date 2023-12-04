const express = require('express'),
    router = express.Router(),
    categoryRouter = require('./category.router'),
    courseRouter = require('./course.router')

const materialRouter = require("./material.router");
const chapterRouter = require("./chapter.router");

router.use('/course', courseRouter);
router.use('/category', categoryRouter);
router.use('/chapter', chapterRouter);
router.use('/material', materialRouter);

module.exports = router;
