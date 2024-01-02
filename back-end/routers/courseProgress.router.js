const express = require("express");

const router = express.Router();
const controller = require("../controllers/courseProgress.controller");
const checkToken = require("../middleware/checkToken");

router.post("/:orderId/:materialId", controller.completeMaterial);
router.get("/", checkToken, controller.getUserProgress);
router.get("/:orderId", controller.getOrderProgress);

module.exports = router;
