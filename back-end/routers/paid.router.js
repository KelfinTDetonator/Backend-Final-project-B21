const router = require("express").Router();
const paidController = require("../controllers/paid.controller");
const checkToken = require("../middleware/checkToken");
const checkRole = require("../middleware/checkRole");

// checkToken, checkRole(["admin"]),
router.get("/", paidController.paySuccess);
router.post("/midtrans/notif", paidController.handlePaymentNotification);

module.exports = router;
