const fsPromises = require("fs").promises;
const utils = require("../utils");
const { material } = require("../models/index");
const { checkFile } = require("../utils/checkVideoType");

module.exports = {
  uploadMaterial: async (req, res) => {
    try {
      const chapterId = Number(req.body.chapterId);
      const { name, description, title } = req.body;

      if (!(name && description && title)) {
        return res.status(400).json({ error: true, message: "Bad Request" });
      }

      const fileBuffer = await fsPromises.readFile(req.file.path);

      checkFile(fileBuffer, res);

      const uploadResponse = await utils.imageKit.upload({
        file: fileBuffer,
        fileName: req.file.originalname,
        folder: "Materials_Videos",
      });

      const uploadToDB = await material.create({
        data: {
          chapterId,
          video_url: uploadResponse.url,
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
      const { name, description, title } = req.body;

      if (typeof materialId !== "number") {
        return res.status(400).json({ error: true, message: "Bad Request" });
      }

      const isExist = await material.findUnique({ where: { id: materialId } });

      if (!isExist) { return res.status(404).json({ error: true, message: "Not Found" }); }

      const fileBuffer = (req.file) ? await fsPromises.readFile(req.file.path) : null;
      if (fileBuffer !== null) {
        checkFile(fileBuffer, res);
        const uploadResponse = await utils.imageKit.upload({
          file: fileBuffer,
          fileName: req.file.originalname,
          folder: "Materials_Videos",
        });

        const allMaterialsByChapterId = await material.findMany({
          where: { chapterId: isExist.chapterId },
        });
        const duration = await utils.getVideoDuration(allMaterialsByChapterId);
        console.log(duration);
        await material.update({
          where: { id: materialId },
          data: {
            // chapterId: chapterId || isExist.chapterId,
            // chapter ID gaboleh diubah ke id lain, karena table chapter perlu sinkron dengan table materi yang baru di-update
            // supaya durasi video yang terbaru sinkron di table chapter dan mencegah inkonsistensi data
            video_url: uploadResponse.url,
            name: name || isExist.name,
            description: description || isExist.description,
            title: title || isExist.title,
            chapter: {
              update: {
                where: { id: chapterId || isExist.chapterId }, // chapter id disini butuh chapter id yang sama dengan di table material
                data: {
                  duration,
                },
              },
            },
          },
          include: {
            chapter: true,
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
      return res.status(200).json({ error: false, message: "200 OK" });
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
