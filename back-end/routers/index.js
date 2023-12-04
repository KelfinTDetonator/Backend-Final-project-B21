const express = require('express'),
      router = express.Router(),
      materialRouter = require("./material.router"),
      categoryRouter = require('./category.router'),
      courseRouter = require('./course.router'),
      chapterRouter = require("./chapter.router"),
      register = require('./user.router'),
      newProfile = require('./profile.router');

router.use('/course', courseRouter);
router.use('/category', categoryRouter);
router.use('/chapter', chapterRouter);
router.use('/material', materialRouter);
router.use('/profile', newProfile)
router.use('/auth', register);

module.exports = router