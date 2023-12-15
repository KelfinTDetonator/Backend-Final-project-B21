const router = require("express").Router();
const chapterController = require("../controllers/chapter.controller");

router.get("/", chapterController.getAllChapter);
router.get("/:id", chapterController.getChapterById);
router.post("/", chapterController.createChapter);
router.patch("/:id", chapterController.patchChapterById);
router.delete("/:id", chapterController.deleteChapterById);

module.exports = router;
