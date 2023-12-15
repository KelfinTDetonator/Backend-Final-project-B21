const express = require("express");

const router = express.Router();
const controller = require("../controllers/course.controller");
const multer = require("multer")();

router.post("/create", multer.single("image"), controller.create);
router.put("/:id", multer.single("image"), controller.update);
router.get("/:id", controller.getId);
router.get("/", controller.getAll);
router.delete("/:id", controller.delete);

module.exports = router;
