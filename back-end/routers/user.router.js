const express = require("express");

const router = express.Router();
const controller = require("../controllers/user.controller");
const checkRole = require("../middleware/checkRole");
const checkToken = require("../middleware/checkToken");

// router.delete("/:id", checkToken, checkRole(["admin"]), controller.deleteUser);
router.delete("/:id", controller.deleteUser);
router.get("/", checkToken, checkRole(["admin"]), controller.getAllUsers);
router.get("/:id", controller.getById);
router.post("/otp", controller.otp);
router.post("/verify", controller.verify);
router.post("/", controller.register);
router.post("/login", controller.login);
router.post("/forget-password", controller.forgetPassword);
router.post("/insert-password", controller.insertPassword);
module.exports = router;
