const router = require("express").Router();
const chapterController = require("../controllers/chapter.controller");

router.post("/createChapter", chapterController.createChapter);
router.patch("/patchChapter/:id", chapterController.patchChapterById);
module.exports = router;
