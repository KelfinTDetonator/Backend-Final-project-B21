const express = require('express'),
    router = express.Router(),
    adminRouter = require('./admin.router'),
    categoryRouter = require('./category.router');

router.use('/admin', adminRouter);
router.use(categoryRouter);

module.exports = router