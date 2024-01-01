const router = require("express").Router();
const paidController = require("../controllers/paid.controller");
const checkToken = require("../middleware/checkToken");
const checkRole = require("../middleware/checkRole");

router.get("/", paidController.paySuccess);

module.exports = router;
