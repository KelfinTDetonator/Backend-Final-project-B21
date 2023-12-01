const fsPromises = require("fs").promises;
const imageKit = require("../utils/imageKit");
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

      const uploadResponse = await imageKit.upload({
        file: fileBuffer,
        fileName: req.file.originalname,
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

      await material.update({
        where: { id: materialId },
        data: {
          chapterId,
          name,
          description,
          title,
        },
      });

      const fileBuffer = await fsPromises.readFile(req.file.path) || null;
      if (fileBuffer !== null) {
        checkFile(fileBuffer, res);
        const uploadResponse = await imageKit.upload({
          file: fileBuffer,
          fileName: req.file.originalname,
        });

        await material.update({
          where: { id: materialId },
          data: {
            chapterId,
            video_url: uploadResponse.url,
            name,
            description,
            title,
          },
        });
        return res.status(200).json({ error: false, message: "200 OK" });
      }

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

      return res.status(204).json({ error: false, message: "Resource deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
};
