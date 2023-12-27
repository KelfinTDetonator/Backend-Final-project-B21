const router = require("express").Router();
const materialController = require("../controllers/material.controller");
const checkToken = require("../middleware/checkToken");
const checkRole = require("../middleware/checkRole");

router.post("/", checkToken, checkRole(["admin"]), materialController.uploadMaterial);
router.get("/", materialController.getAllMaterial); // get all
router.get("/:id", materialController.getMaterialById);
router.patch("/:id", checkToken, checkRole(["admin"]), materialController.patchMaterialById);
router.delete("/:id", checkToken, checkRole(["admin"]), materialController.deleteMaterialById);

module.exports = router;
