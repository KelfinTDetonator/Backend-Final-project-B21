const router = require("express").Router();
const materialController = require("../controllers/material.controller");
const storage = require("../middlewares/multer");

router.post("/", storage.upload.single("video"), materialController.uploadMaterial);
router.get("/", materialController.getAllMaterial); // get all
router.get("/:id", materialController.getMaterialById);
router.patch("/:id", materialController.patchMaterialById);
router.delete("/:id", materialController.deleteMaterialById);

module.exports = router;
