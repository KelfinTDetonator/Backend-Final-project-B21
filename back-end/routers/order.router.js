const router = require("express").Router();
const orderController = require("../controllers/order.controller");

router.post("/create", orderController.createNewOrder);
router.delete("/delete/:id", orderController.deleteCourseFromOrder);

module.exports = router;
