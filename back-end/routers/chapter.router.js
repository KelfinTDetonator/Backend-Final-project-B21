const router = require("express").Router();
const chapterController = require("../controllers/chapter.controller");
const checkToken = require("../middleware/checkToken");
const checkRole = require("../middleware/checkRole");

router.get("/", chapterController.getAllChapter);
router.get("/:id", chapterController.getChapterById);
router.post("/", checkToken, checkRole(["admin"]), chapterController.createChapter);
router.patch("/:id", checkToken, checkRole(["admin"]), chapterController.patchChapterById);
router.delete("/:id", checkToken, checkRole(["admin"]), chapterController.deleteChapterById);

module.exports = router;
