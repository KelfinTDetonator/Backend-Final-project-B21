const router = require("express").Router();
const chapterController = require("../controllers/chapter.controller");

router.get("/chapters", chapterController.getAllChapter);
router.get("/chapter/:id", chapterController.getChapterById);
router.post("/createChapter", chapterController.createChapter);
router.patch("/patchChapter/:id", chapterController.patchChapterById);
router.delete("/deleteChapter/:id", chapterController.deleteChapterById);

module.exports = router;
