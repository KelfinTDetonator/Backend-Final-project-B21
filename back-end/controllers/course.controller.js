const { course } = require("../models")
const utils = require("../utils")

module.exports = {
  create: async (req, res) => {
    try {
      const fileToString = req.file.buffer.toString("base64")

      const uploadFile = await utils.imageKit.upload({
        fileName: req.file.originalname,
        file: fileToString,
        folder: "CourseImage"
      })

      if (!["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(req.body.level)) {
        return res.status(400).json({ error: "Invalid level" })
      }

      if (!["FREE", "PREMIUM"].includes(req.body.type)) {
        return res.status(400).json({ error: "Invalid type" })
      }

      const data = await course.create({
        data: {
          name: req.body.name,
          price: parseInt(req.body.price),
          modul: parseInt(req.body.modul),
          rating: parseFloat(req.body.rating),
          description: req.body.description,
          imageUrl: uploadFile.url,
          author: req.body.author,
          groupUrl: req.body.group_url,
          level: req.body.level,
          type: req.body.type,
          isActive: Boolean(req.body.is_active) || false,
          categoryId: parseInt(req.body.category_id)
        }
      })

      return res.status(201).json({
        data
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error
      })
    }
  },

  getId: async (req, res) => {
    try {
      const courses = await course.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
        include: {
          category: true,
          Chapter: true,
        },
      })

      return res.status(201).json({
        courses
      })
    } catch (error) {
      return res.status(500).json({
        error
      })
    }
  },

  getAll: async (req, res) => {
    try {
      const {
        level, type, categoryId, page = 1, pageSize = 6, search
      } = req.query
      const filter = {}

      if (level) {
        filter.level = level
      }
      if (type) {
        filter.type = type
      }
      if (categoryId) {
        filter.categoryId = parseInt(categoryId)
      }
      if (search) {
        filter.name = { contains: search, mode: 'insensitive' }
      }

      const offset = (page - 1) * pageSize

      const courses = await course.findMany({
        where: filter,
        include: {
          category: true,
          Chapter: {
            select: { duration: true }
          }
        },
        take: parseInt(pageSize),
        skip: offset
      })

      const courseTotalDuration = courses.map((course) => {
        const chapterDurations = course.Chapter.map((chapter) => chapter.duration)
        const totalDuration = chapterDurations.reduce((sum, duration) => sum + (duration || 0), 0)
        return {
          ...course,
          totalDuration
        }
      })

      return res.status(200).json({
        courses: courseTotalDuration,
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize)
      })
    } catch (error) {
      return res.status(500).json({
        error
      })
    }
  },

  update: async (req, res) => {
    try {
      const fileToString = req.file.buffer.toString("base64")

      const uploadFile = await utils.imageKit.upload({
        fileName: req.file.originalname,
        file: fileToString,
        folder: "CourseImage"
      })

      if (!["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(req.body.level)) {
        return res.status(400).json({ error: "Invalid level" })
      }

      if (!["FREE", "PREMIUM"].includes(req.body.type)) {
        return res.status(400).json({ error: "Invalid type" })
      }

      const data = await course.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: req.body.name,
          price: parseInt(req.body.price),
          modul: parseInt(req.body.modul),
          rating: req.body.rating,
          description: req.body.description,
          imageUrl: uploadFile.url,
          author: req.body.author,
          groupUrl: req.body.group_url,
          level: req.body.level,
          type: req.body.type,
          isActive: req.body.is_active || false,
          categoryId: parseInt(req.body.category_id)
        }
      })

      return res.status(201).json({
        data
      })
    } catch (error) {
      return res.status(500).json({
        error
      })
    }
  },

  delete: async (req, res) => {
    try {
      const data = await course.delete({
        where: {
          id: parseInt(req.params.id)
        }
      })

      return res.status(204).json()
    } catch (error) {
      return res.status(500).json({
        error
      })
    }
  }
}
