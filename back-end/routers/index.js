const express = require("express");

const router = express.Router();
const materialRouter = require("./material.router");
const categoryRouter = require("./category.router");
const courseRouter = require("./course.router");
const chapterRouter = require("./chapter.router");
const register = require("./user.router");
const newProfile = require("./profile.router");
const notif = require('./notification.router')
const orderRouter = require("./order.router");

router.use("/course", courseRouter);
router.use("/category", categoryRouter);
router.use("/chapter", chapterRouter);
router.use("/material", materialRouter);
router.use("/profile", newProfile);
router.use("/auth", register);
router.use('/notification', notif)
router.use("/order", orderRouter);

module.exports = router;
