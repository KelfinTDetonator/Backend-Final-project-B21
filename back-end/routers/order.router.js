const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const checkToken = require('../middleware/checkToken')

router.post("/midtrans/:courseId",checkToken, orderController.createPayment);
router.delete("/delete/:id", orderController.deleteCourseFromOrder);
router.post ("/midtrans/notif", orderController.handlePaymentNotification)

module.exports = router;
