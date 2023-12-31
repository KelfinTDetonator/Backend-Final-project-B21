const router = require("express").Router();

const checkToken = require("../middleware/checkToken");
const checkRole = require("../middleware/checkRole");
const paymentController = require("../controllers/payment.controller");

router.get("/", checkToken, checkRole(["admin", "user"]), paymentController.payment);
router.get("/page/:id", paymentController.paymentPage);

module.exports = router;
