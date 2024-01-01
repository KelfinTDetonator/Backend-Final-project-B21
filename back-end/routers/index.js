const express = require("express");

const router = express.Router();
const materialRouter = require("./material.router");
const categoryRouter = require("./category.router");
const courseRouter = require("./course.router");
const chapterRouter = require("./chapter.router");
const register = require("./user.router");
const newProfile = require("./profile.router");
const orderRouter = require("./order.router");
const paymentRouter = require("./payment.router");
const paidRouter = require("./paid.router");
const notif = require("./notification.router");
const courseProgressRouter = require("./courseProgress.router");

router.use("/course", courseRouter);
router.use("/category", categoryRouter);
router.use("/chapter", chapterRouter);
router.use("/material", materialRouter);
router.use("/profile", newProfile);
router.use("/auth", register);
router.use("/order", orderRouter);
router.use("/payment", paymentRouter);
router.use("/done", paidRouter);
router.use("/notification", notif);
router.use("/progress", courseProgressRouter);
module.exports = router;
