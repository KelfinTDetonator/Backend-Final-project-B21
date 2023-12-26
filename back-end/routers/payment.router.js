const router = require("express").Router();

const checkToken = require("../middleware/checkToken");
const checkRole = require("../middleware/checkRole");
const paymentController = require("../controllers/payment.controller");

// router.get("/", checkToken, checkRole(["user"]), paymentController.payment);
router.get("/:id", paymentController.payment);
module.exports = router;
