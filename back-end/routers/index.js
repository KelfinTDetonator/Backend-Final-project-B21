const express = require("express");

const router = express.Router();
const categoryRouter = require("./category.router");
const materialRouter = require("./material.router");
const chapterRouter = require("./chapter.router");

router.use(categoryRouter);
router.use(chapterRouter);
router.use(materialRouter);

module.exports = router;
