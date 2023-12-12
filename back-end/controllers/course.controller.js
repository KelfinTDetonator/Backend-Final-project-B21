const { course } = require("../models");
const utils = require("../utils");

module.exports = {
  create: async (req, res) => {
    try {
      const fileToString = req.file.buffer.toString("base64");

      const uploadFile = await utils.imageKit.upload({
        fileName: req.file.originalname,
        file: fileToString,
        folder: "CourseImage",
      });

      if (!["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(req.body.level)) {
        return res.status(400).json({ error: "Invalid level" });
      }

      if (!["FREE", "PREMIUM"].includes(req.body.type)) {
        return res.status(400).json({ error: "Invalid type" });
      }

      const data = await course.create({
        data: {
          name: req.body.name,
          price: req.body.price,
          modul: parseInt(req.body.modul),
          duration: req.body.duration,
          rating: parseFloat(req.body.rating),
          description: req.body.description,
          imageUrl: uploadFile.url,
          author: req.body.author,
          groupUrl: req.body.group_url,
          level: req.body.level,
          type: req.body.type,
          isActive: Boolean(req.body.is_active) || false,
          categoryId: parseInt(req.body.category_id),
        },
      });

      return res.status(201).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },

  getId: async (req, res) => {
    try {
      const data = await course.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      return res.status(201).json({
        data,
      });
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const { level, type, categoryId } = req.query;
      const filter = {};

      if (level) {
        filter.level = level;
      }
      if (type) {
        filter.type = type;
      }
      if (categoryId) {
        filter.categoryId = parseInt(categoryId);
      }

      const data = await course.findMany({
        where: filter,
        include: {
          category: true,
        },
      });

      return res.status(200).json({
        data,
      });
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const fileToString = req.file.buffer.toString("base64");

      const uploadFile = await utils.imageKit.upload({
        fileName: req.file.originalname,
        file: fileToString,
        folder: "CourseImage",
      });

      if (!["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(req.body.level)) {
        return res.status(400).json({ error: "Invalid level" });
      }

      if (!["FREE", "PREMIUM"].includes(req.body.type)) {
        return res.status(400).json({ error: "Invalid type" });
      }

      const data = await course.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: req.body.name,
          price: req.body.price,
          modul: parseInt(req.body.modul),
          duration: req.body.duration,
          rating: req.body.rating,
          description: req.body.description,
          imageUrl: uploadFile.url,
          author: req.body.author,
          groupUrl: req.body.group_url,
          level: req.body.level,
          type: req.body.type,
          isActive: req.body.is_active || false,
          categoryId: parseInt(req.body.category_id),
        },
      });

      return res.status(201).json({
        data,
      });
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const data = await course.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });

      return res.status(204).json();
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  },
};
