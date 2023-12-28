const Joi = require("joi");
const { order, user, course } = require("../models/index");

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

      if (checkCourse.price !== 0 && checkOrder) { // if course is not paid yet
        return res.status(409).json({ error: true, message: "Duplicate! Please finish your previous payment" });
      } if (checkOrder) {
        return res.status(409).json({ error: true, message: "Duplicate! You have this course" });
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
      const userId = Number(req.user.id);
      const courseId = Number(req.body.courseId);

      if (!userId) { return res.status(403).json({ error: true, message: "Login first" }); }

      const checkOrder = await order.findFirst({
        where: {
          userId,
          courseId,
        },
      });

      if (!checkOrder) { return res.status(404).json({ error: true, message: "Order Data Not Found" }); }

      const checkCourse = await course.findUnique({
        where: { id: courseId },
      });

      if (!checkCourse) {
        return res.status(404).json({
          error: true,
          message: `Course with ID:${courseId} is not found`,
        });
      }

      const data = await order.update({
        where: { id: checkOrder.id },
        data: {
          courseId,
        },
      });

      return res.status(200).json({
        error: false,
        message: "Cart is up to date!",
        order_data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  patchOrderById: async (req, res) => {
    try {
      const orderId = Number(req.params.id);

      const userId = Number(req.body.userId);
      const courseId = Number(req.body.courseId);
      const { status } = req.body;
      const { paymentMethod } = req.body;

      const checkOrder = await order.findFirst({
        where: {
          // userId: checkUser.id,
          id: orderId,
        },
      });

      if (!checkOrder) { return res.status(404).json({ error: true, message: "Order Data Not Found" }); }

      const checkCourse = await course.findUnique({
        where: { id: courseId || checkOrder.courseId },
      });

      const data = await order.update({
        where: { id: checkOrder.id },
        data: {
          total_price: checkCourse.price || checkOrder.total_price,
          payment_method: paymentMethod,
          courseId: courseId || checkOrder.courseId,
          userId: userId || checkOrder.userId,
          status: status || checkCourse.status,
        },
      });

      return res.status(200).json({
        error: false,
        message: "Cart is up to date!",
        order_data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  deleteOrderData: async (req, res) => {
    try {
      const orderId = Number(req.params.id);

      const orderData = order.findUnique({ where: { id: orderId } });
      if (!orderData) { return res.status(404).json({ error: true, message: "Order Data Not Found" }); }

      await order.delete({ where: { id: orderId } });

      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
};
