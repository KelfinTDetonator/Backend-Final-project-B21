const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const checkToken = require("../middleware/checkToken");
const checkRole = require("../middleware/checkRole");

// todo: checkRole(["user"]),
router.post("/create", checkToken, checkRole(["user", "admin"]), orderController.createNewOrder);
router.patch("/update/:id", checkToken, checkRole(["admin", "user"]), orderController.patchOrder);
router.delete("/delete/:id", checkToken, checkRole(["admin"]), orderController.deleteOrderData);
// router.post("/midtrans/notif", orderController.handlePaymentNotification);

module.exports = router;
