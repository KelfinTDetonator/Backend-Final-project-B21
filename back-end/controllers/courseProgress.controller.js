const { courseProgress, order, user } = require("../models")

module.exports = {
  completeMaterial: async (req, res) => {
    try {
      const { orderId, materialId } = req.params;

      const progressExist = await courseProgress.findFirst({
        where: {
          orderId: parseInt(orderId),
          materialId: parseInt(materialId),
          isComplete: true,
        },
      })

      if (progressExist) {
        return res.status(400).json({
          error: true,
          message: 'User already access this material.',
        });
      }

      await courseProgress.create({
        data: {
          orderId: parseInt(orderId),
          materialId: parseInt(materialId),
          isComplete: true
        }
      })


      res.status(200).json({
        message: 'Material accessed successfully.'
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error.' })
    }
  },

  getUserProgress: async (req, res) => {
    try {
      const data = await order.findMany({
        where: {userId: parseInt(req.params.userId)},
        include: {
          courseProgress: true
        }
      })
      
      if (!data.length) {
        return res.status(404).json({
          error: {
            message: 'User not found.'
          }
        })
      }

      return res.status(200).json({
        data
      })
      
    } catch (error) {
      return res.status(500).json({
        error
      })
    }
  },

  getOrderProgress: async (req, res) => {
    try {
      const data = await courseProgress.findMany({
        where: {
          orderId: parseInt(req.params.orderId)
        }
      })

      if (!data.length) {
        return res.status(404).json({
          error: {
            message: 'Order not found.'
          }
        })
      }

      return res.status(200).json({
        data
      })
      
    } catch (error) {
      return res.status(500).json({
        error
      })
    }
  }
}