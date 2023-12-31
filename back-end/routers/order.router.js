const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const checkToken = require("../middleware/checkToken");
const checkRole = require("../middleware/checkRole");

// todo: checkRole(["user"]),
router.get("/all", checkToken, checkRole(["admin"]), orderController.getAllOrder);
router.get("/:id", checkToken, checkRole(["admin", "user"]), orderController.getOrderInfo);
router.post("/create", checkToken, checkRole(["user", "admin"]), orderController.createNewOrder);
// router.patch("/:id", checkToken, checkRole(["admin", "user"]), orderController.patchOrder);
router.patch("/admin/:id", checkToken, checkRole(["admin"]), orderController.patchOrderById);
router.delete("/delete/:id", checkToken, checkRole(["admin"]), orderController.deleteOrderData);
router.get("/", checkToken, checkRole(["admin", "user"]), orderController.getById);

module.exports = router;
