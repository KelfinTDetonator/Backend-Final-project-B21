const { courseProgress, order, material } = require("../models");

module.exports = {
  completeMaterial: async (req, res) => {
    try {
      const { orderId, materialId } = req.params;

      const checkOrder = await order.findUnique({
        where: {
          id: parseInt(orderId),
        },
      });

      if (!checkOrder) {
        return res.status(404).json({
          error: true,
          message: "Order not found.",
        });
      }

      if (checkOrder.status !== "PAID") {
        return res.status(400).json({
          error: true,
          message: "Order is not PAID. Material access is allowed only for PAID orders.",
        });
      }

      const checkMaterial = await material.findUnique({
        where: {
          id: parseInt(materialId),
        },
      });

      if (!checkMaterial) {
        return res.status(404).json({
          error: true,
          message: "Material not found.",
        });
      }

      const progressExist = await courseProgress.findFirst({
        where: {
          materialId: parseInt(materialId),
          isComplete: true,
        },
      });
  
      if (progressExist) {
        return res.status(400).json({
          error: true,
          message: "Material is inaccessible or already accessed",
        });
      }

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
      const data = await order.findMany({
        where: {userId: parseInt(req.user.id)},
        include: {
          courseProgress: true
        }
      })
      
      if (!data.length) {
        return res.status(404).json({
          error: {
            message: "User order doesn't exist.",
          },
        });
      }

      return res.status(200).json({
        data,
      });
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  },

  getOrderProgress: async (req, res) => {
    try {
      const data = await courseProgress.findMany({
        where: { orderId: parseInt(req.params.orderId) },
      });

      if (!data.length) {
        return res.status(404).json({
          error: {
            message: "User progress doesn't exist.",
          },
        });
      }

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
