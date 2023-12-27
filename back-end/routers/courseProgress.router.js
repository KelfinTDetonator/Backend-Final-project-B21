const express = require("express");
const router = express.Router();
const controller = require("../controllers/courseProgress.controller");

router.post('/:orderId/:materialId', controller.completeMaterial);
router.get('/:orderId', controller.getUserProgress)

module.exports = router