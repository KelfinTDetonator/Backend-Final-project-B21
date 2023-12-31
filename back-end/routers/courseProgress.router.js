const express = require("express");

const router = express.Router();
const controller = require("../controllers/courseProgress.controller");

router.post('/:orderId/:materialId', controller.completeMaterial);
router.get('/:userId', controller.getUserProgress)
router.get('/order/:orderId', controller.getOrderProgress)

module.exports = router;
