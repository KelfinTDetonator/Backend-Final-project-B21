const { material } = require("../models/index");

module.exports = {
  uploadMaterial: async (req, res) => {
    try {
      const chapterId = Number(req.body.chapterId);
      console.log(req.body.chapterId);
      const {
        name, description, title, videoUrl,
      } = req.body;
      console.log(name, description, title, videoUrl);
      if (!(name && description && title && videoUrl)) {
        return res.status(400).json({ error: true, message: "Bad Request" });
      }

      const uploadToDB = await material.create({
        data: {
          chapterId,
          videoUrl,
          name,
          description,
          title,
        },
      });

      return res.status(201).json({
        error: false,
        message: "Upload success",
        upload_info: uploadToDB,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  getAllMaterial: async (req, res) => {
    try {
      const data = await material.findMany();

      return res.status(200).json({ error: false, videos: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  getMaterialById: async (req, res) => {
    try {
      const materialId = Number(req.params.id);
      if (typeof materialId !== "number") {
        return res.status(400).json({ error: true, message: "Bad Request" });
      }

      const data = await material.findUnique({ where: { id: materialId } });

      if (!data) { return res.status(404).json({ error: true, message: "Not Found" }); }

      return res.status(200).json({
        error: false,
        message: "200 OK",
        material: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  patchMaterialById: async (req, res) => {
    try {
      const materialId = Number(req.params.id);
      const chapterId = Number(req.body.chapterId);
      const {
        name, description, title, videoUrl,
      } = req.body;

      if (typeof materialId !== "number") {
        return res.status(400).json({ error: true, message: "Bad Request" });
      }

      const isExist = await material.findUnique({ where: { id: materialId } });

      if (!isExist) { return res.status(404).json({ error: true, message: "Not Found" }); }

      if (videoUrl !== undefined) {
        await material.update({
          where: { id: materialId },
          data: {
            // chapterId: chapterId || isExist.chapterId,
            // chapter ID gaboleh diubah ke id lain, karena table chapter perlu sinkron dengan table materi yang baru di-update
            // supaya durasi video yang terbaru sinkron di table chapter dan mencegah inkonsistensi data
            videoUrl,
            name: name || isExist.name,
            description: description || isExist.description,
            title: title || isExist.title,
          },
        });
        return res.status(200).json({ error: false, message: "200 OK" });
      }
      // jika video tidak terdapat update
      await material.update({
        where: { id: materialId },
        data: {
          chapterId: chapterId || isExist.chapterId,
          name: name || isExist.name,
          description: description || isExist.description,
          title: title || isExist.title,
        },
      });
      return res.status(200).json({ error: false, message: "200 OK 1" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  deleteMaterialById: async (req, res) => {
    try {
      const materialId = Number(req.params.id);

      if (typeof materialId !== "number") {
        return res.status(400).json({ error: true, message: "Bad Request" });
      }

      const isExist = await material.findUnique({ where: { id: materialId } });

      if (!isExist) { return res.status(404).json({ error: true, message: "Not Found" }); }

      await material.delete({ where: { id: materialId } });

      return res.status(200).json({ error: false, message: "Resource deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
};
