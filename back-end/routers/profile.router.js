const express = require("express");
const checkRole = require("../middleware/checkRole");
const checkToken = require("../middleware/checkToken");

const router = express.Router();
const controller = require("../controllers/profile.controller");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", checkToken, checkRole(["user"]), upload.single("profile_picture"), controller.create);
router.put("/", checkToken, checkRole(["admin", "user"]), upload.single("profile_picture"), controller.update);
router.get("/", checkToken, checkRole(["user"]), controller.getId);
router.delete("/:id", checkToken, checkRole(["user"]), controller.delete);
router.get("/all", checkToken, checkRole(["admin"]), controller.getAll);

module.exports = router;
