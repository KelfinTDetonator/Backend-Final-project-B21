const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const checkToken = require("../middleware/checkToken");
const checkRole = require("../middleware/checkRole");

// todo: checkRole(["user"]),
router.post("/create", checkToken, checkRole(["user"]), orderController.createNewOrder);

router.delete("/delete/:id", orderController.deleteCourseFromOrder);

module.exports = router;
