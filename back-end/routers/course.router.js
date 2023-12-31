const express = require("express");

const router = express.Router();
const controller = require("../controllers/course.controller");
const multer = require("multer")();
const checkToken = require("../middleware/checkToken");
const checkRole = require("../middleware/checkRole");

router.post("/create", checkToken, checkRole(["admin"]), multer.single("image"), controller.create);
router.put("/:id", checkToken, checkRole(["admin"]), multer.single("image"), controller.putUpdate);
router.patch("/:id", checkToken, checkRole(["admin"]), controller.patchUpdate);
router.get("/:id", controller.getId);
router.get("/", controller.getAll);
router.delete("/:id", checkToken, checkRole(["admin"]), controller.delete);

module.exports = router;
