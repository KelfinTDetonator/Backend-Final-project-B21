const { category } = require("../models/index");

module.exports = {
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) { return res.status(400).json({ error: true, message: "Bad Request Error" }); }

      const categoryName = await category.findFirst({ where: { name } });

      if (categoryName) { return res.status(409).json({ error: true, message: "Data conflict" }); }

      const create = await category.create({ data: { name } });

      return res.status(201).json({
        error: false,
        message: `Category: ${name} created!`,
        category: create,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  getCategory: async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) { return res.status(400).json({ error: true, message: "Bad Request Error" }); }

      const categoryData = await category.findUnique({ where: { id } });
      if (!categoryData) { return res.status(404).json({ error: true, message: "Category Not Found" }); }

      return res.status(200).json({
        error: false,
        message: "200 OK",
        category: categoryData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  getAllCategory: async (req, res) => {
    try {
      const allData = await category.findMany();

      return res.status(200).json({
        error: false,
        message: "200 OK",
        categories: allData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  patchCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const id = Number(req.params.id);

      if (!(id && name)) { return res.status(400).json({ error: true, message: "Bad Request Error" }); }

      const categoryData = await category.findUnique({ where: { id } });
      if (!categoryData) { return res.status(404).json({ error: true, message: "Category Not Found" }); }

      await category.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      return res.status(200).json({
        error: false,
        message: "200 OK",
        category: categoryData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) { return res.status(400).json({ error: true, message: "Bad Request Error" }); }

      const categoryData = await category.findUnique({ where: { id } });
      if (!categoryData) { return res.status(404).json({ error: true, message: "Category Not Found" }); }

      await category.delete({ where: { id } });

      return res.status(200).json({ error: false, message: "Resource deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
};
