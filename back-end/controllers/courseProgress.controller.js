const { courseProgress, course } = require("../models");

module.exports = {
  completeMaterial: async (req, res) => {
    try {
      const { orderId, materialId } = req.params;

      await courseProgress.create({
        data: {
          orderId: parseInt(orderId),
          materialId: parseInt(materialId),
          isComplete: true,
        },
      });

      res.status(200).json({
        message: "Material accessed successfully.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  },

  getUserProgress: async (req, res) => {
    try {
      const data = await courseProgress.findMany({
        where: {
          orderId: parseInt(req.params.orderId),
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
};
