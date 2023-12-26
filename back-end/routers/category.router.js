const router = require("express").Router();
const categoryController = require("../controllers/category.controller");
const checkToken = require("../middleware/checkToken");
const checkRole = require("../middleware/checkRole");

router.get("/:id", categoryController.getCategory);
router.get("/", categoryController.getAllCategory);
router.post("/", checkToken, checkRole(["admin"]), categoryController.createCategory);
router.patch("/:id", checkToken, checkRole(["admin"]), categoryController.patchCategory);
router.delete("/:id", checkToken, checkRole(["admin"]), categoryController.deleteCategory);

module.exports = router;
