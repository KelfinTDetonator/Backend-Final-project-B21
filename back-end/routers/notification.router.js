const express = require("express");

const router = express.Router();
const controller = require("../controllers/notification.controller");
const checkRole = require("../middleware/checkRole");
const checkToken = require("../middleware/checkToken");

// router.get('/', controller.getAll),
// router.get('/:id',checkToken, checkRole(["admin", "user"]), controller.getId)
router.get("/", checkToken, controller.getByUserId);
router.delete("/:id", controller.delete);
// router.post('/',checkToken, controller.create)

module.exports = router;
