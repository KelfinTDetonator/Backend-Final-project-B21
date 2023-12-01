const router = require("express").Router();
const materialController = require("../controllers/material.controller");
const storage = require("../middlewares/multer");

router.post("/videoMaterial", storage.upload.single("video"), materialController.uploadMaterial);
router.get("/videoMaterial", materialController.getAllMaterial); // get all
router.get("/videoMaterial/:id", materialController.getMaterialById);
router.patch("/videoMaterial/:id", materialController.patchMaterialById);
router.delete("/videoMaterial/:id", materialController.deleteMaterialById);
module.exports = router;
