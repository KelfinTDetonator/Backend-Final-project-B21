const router = require("express").Router();
const categoryController = require("../controllers/category.controller");

router.get("/:id", categoryController.getCategory);
router.get("/", categoryController.getAllCategory);
router.post("/", categoryController.createCategory);
router.patch("/:id", categoryController.patchCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
