const router = require("express").Router();
const orderController = require("../controllers/order.controller");
<<<<<<< HEAD
const checkToken = require('../middleware/checkToken')

router.post("/midtrans/:courseId",checkToken, orderController.createPayment);
=======
const checkToken = require("../middleware/checkToken");
const checkRole = require("../middleware/checkRole");

// todo: checkRole(["user"]),
router.post("/create", checkToken, checkRole(["user", "admin"]), orderController.createNewOrder);
router.patch("/update", checkToken, checkRole(["admin"]), orderController.patchOrder);
>>>>>>> kelfin
router.delete("/delete/:id", orderController.deleteCourseFromOrder);
router.post ("/midtrans/notif", orderController.handlePaymentNotification)

module.exports = router;
