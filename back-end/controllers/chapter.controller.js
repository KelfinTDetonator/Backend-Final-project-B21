const { chapter, course, material } = require("../models/index");

module.exports = {
  createChapter: async (req, res) => {
    try {
      const { name } = req.body;
      const courseId = Number(req.body.courseId);

      if (!(name && courseId)) { return res.status(400).json({ error: true, message: "Bad Request" }); }

      const courseData = await course.findUnique({ where: { id: courseId } });

      if (!courseData) { return res.status(404).json({ error: true, message: "Course not found" }); }

      const newChapter = await chapter.create({
        data: {
          name,
          courseId,
          duration: Number(req.body.duration) || null,
        },
      });

      return res.status(201).json({
        error: false,
        message: "Created successfully",
        chapter: newChapter,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  patchChapterById: async (req, res) => {
    const chapterId = Number(req.params.id);
    const duration = Number(req.body.duration);
    if (!chapterId) { return res.status(400).json({ error: true, message: "Bad request" }); }

    const courseId = Number(req.body.courseId);
    const { name } = req.body;

    const chapterData = await chapter.findUnique({ where: { id: chapterId } });
    if (!chapterData) { return res.status(404).json({ error: true, message: "Chapter not found" }); }

    if (courseId) {
      const courseData = await course.findUnique({ where: { id: courseId } });
      if (!courseData) { return res.status(404).json({ error: true, message: "Course not found" }); }
    }

    await chapter.update({
      where: {
        id: chapterData.id,
      },
      data: {
        name: (name) || chapterData.name,
        duration,
        courseId: (courseId) || chapterData.courseId,
      },
    });

    return res.status(200).json({ error: false, message: "Chapter data is up to date!" });
  },

  getChapterById: async (req, res) => {
    try {
      const chapterId = Number(req.params.id);
      if (!chapterId) { return res.status(400).json({ error: true, message: "Bad request" }); }

      const chapterData = await chapter.findUnique({ where: { id: chapterId } });
      if (!chapterData) { return res.status(404).json({ error: true, message: "Chapter not found" }); }

      return res.status(200).json({
        error: false,
        message: "200 OK",
        chapter: chapterData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  getAllChapter: async (req, res) => {
    try {
      const allChapter = await chapter.findMany({
        include: { material: true },
      });
      if (!allChapter) { return res.status(404).json({ error: true, message: "Chapter is not created yet!" }); }

      return res.status(200).json({
        error: false,
        message: "",
        chapters: allChapter,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  deleteChapterById: async (req, res) => {
    try {
      const chapterId = Number(req.params.id);
      if (!chapterId) { return res.status(400).json({ error: true, message: "Bad request" }); }

      const chapterData = await chapter.findUnique({ where: { id: chapterId } });
      if (!chapterData) { return res.status(404).json({ error: true, message: "Chapter not found" }); }

      await chapter.delete({ where: { id: chapterId } });
      return res.status(200).json({ error: false, message: "Chapter deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
};
