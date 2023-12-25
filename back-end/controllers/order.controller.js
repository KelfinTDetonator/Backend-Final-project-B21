const { order, user, course } = require("../models/index");
const Joi = require("joi");

const orderValidation = Joi.object({
  courseId: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
  // paymentMethod: Joi.string().min(4).required(),
});

module.exports = {
  createNewOrder: async (req, res) => {
    try {
      req.body.userId = req.user.id;
      const { error } = await orderValidation.validateAsync(req.body);

      if (error) {
        return res.status(400).json({ err: true, message: error.details[0].message });
      }

      const { paymentMethod } = req.body;
      const courseId = Number(req.body.courseId);
      const userId = Number(req.body.userId);
      const checkCourse = await course.findUnique({ where: { id: courseId } });
      if (!checkCourse) { return res.status(404).json({ error: true, message: `Course with ID: ${courseId} is not exist` }); }

      const checkUser = await user.findUnique({ where: { id: userId } });

      if (!checkUser) { return res.status(404).json({ error: true, message: `User with ID: ${userId} is not exist` }); }

      const checkOrder = await order.findFirst({
        where: {
          courseId,
          userId,
        },
      });

      if (checkOrder) {
        return res.status(409).json({ error: true, message: "Duplicate! Order is already exist" });
      } if (checkOrder.status === "UNPAID") {
        return res.status(409).json({ error: true, message: "Duplicate! Please finish your previous payment" });
      }

      const data = await order.create({
        data: {
          total_price: checkCourse.price,
          payment_method: paymentMethod || null,
          courseId,
          userId,
          status: (checkCourse.price === 0) ? "PAID" : "UNPAID",
        },
      });

      return res.status(201).json({
        error: false,
        message: "Course is added to the cart",
        order_data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  patchOrder: async (req, res) => {
    try {
      req.body.userId = req.user.id;
      const userId = Number(req.body.userId);
      const courseId = Number(req.body.courseId);
      const status = req.body.status;
      const { paymentMethod } = req.body;

      const checkCourse = await course.findUnique({ where: { id: courseId } });
      if (!checkCourse) { return res.status(404).json({ error: true, message: `Course with ID: ${courseId} is not exist` }); }

      const checkUser = await user.findUnique({ where: { id: userId } });

      if (!checkUser) { return res.status(404).json({ error: true, message: `User with ID: ${userId} is not exist` }); }

      const checkOrder = await order.findFirst({
        where: {
          courseId,
          userId,
        },
      });

      if (checkOrder) {
        return res.status(409).json({ error: true, message: "Duplicate! Order is already exist" });
      } if (checkOrder.status === "UNPAID") {
        return res.status(409).json({ error: true, message: "Duplicate! Please finish your previous payment" });
      }

      const data = await order.create({
        data: {
          total_price: checkCourse.price,
          payment_method: paymentMethod || null,
          courseId,
          userId,
          status: (checkCourse.price === 0) ? "PAID" : "UNPAID",
        },
      });

      return res.status(201).json({
        error: false,
        message: "Course is added to the cart",
        order_data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  patchOrder: async (req, res) => {
    try {
      req.body.userId = req.user.id;
      const userId = Number(req.body.userId);
      const courseId = Number(req.body.courseId);
      const status = req.body.status;
      const { paymentMethod } = req.body;

      const checkCourse = await course.findUnique({ where: { id: courseId } });
      if (!checkCourse) { return res.status(404).json({ error: true, message: `Course with ID: ${courseId} is not exist` }); }

      const checkUser = await user.findUnique({ where: { id: userId } });

      if (!checkUser) { return res.status(404).json({ error: true, message: `User with ID: ${userId} is not exist` }); }

      const checkOrder = await order.findFirst({
        where: {
          userId: user.id,
          courseId: course.id,
        },
      });

      if (checkOrder) {
        const data = await order.update({
          where: { id: checkOrder.id },
          data: {
            total_price: checkCourse.price,
            payment_method: paymentMethod,
            courseId,
            userId,
            status: status || checkCourse.status,
          },
        });

        return res.status(200).json({
          error: false,
          message: "Cart is up to date!",
          order_data: data,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  deleteCourseFromOrder: async (req, res) => {
    try {
      const courseId = Number(req.params.id);

      const courseData = await order.findFirst({ where: { courseId } });

      if (!courseData) { return res.status(404).json({ error: true, message: `Course with ID: ${courseId} is not exist` }); }

      await order.delete({ where: { id: courseData.id } });

      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
};
