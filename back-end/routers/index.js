const express = require("express");

const router = express.Router();
const categoryRouter = require("./category.router");
const materialRouter = require("./material.router");

router.use(categoryRouter);
router.use(materialRouter);

module.exports = router;
