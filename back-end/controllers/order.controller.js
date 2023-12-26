<<<<<<< HEAD
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const midtransClient = require("midtrans-client");
const { order, course, user, profile } = require("../models/index");
const { PAYMENT_SERVER_KEY } = process.env;
const utils = require('../utils/index')
=======
const Joi = require("joi");
const { order, course, user } = require("../models/index");
>>>>>>> kelfin

const orderValidation = Joi.object({
  courseId: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
  // paymentMethod: Joi.string().min(4).required(),
});

module.exports = {
  createPayment: async (req, res, next) => {
    try {
<<<<<<< HEAD
      const courseId = req.params.courseId;
      const {payment_method} =  req.body
  
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: PAYMENT_SERVER_KEY,
      });
  
      const user = await prisma.user.findUnique({
        where: { id: Number(req.user.id) },
        include: {
          profile: true,
        },
      });
  
      const course = await prisma.course.findUnique({
        where: { id: Number(courseId) },
      });
  
      const userHasCourse = await prisma.order.findFirst({
        where: {
          userId: user.id,
          courseId: course.id,
        },
      });
  
      if (userHasCourse) {
        return res.status(400).json({
          status: false,
          message: "Anda sudah membeli kelas ini.",
          data: null,
        });
      }

      if(!course || !user) {
        return res.status(404).json({
          status: false,
          message:"not found",
          data: null,
        })
      }
  
      let newPayment = await prisma.order.create({
        data: {
          total_price: parseInt(course.price),
          courseId: Number(courseId),
          userId: parseInt(req.user.id),
          payment_method,
          createdAt: new Date(),
          updatedAt: new Date() 
        },
      });
  
      let parameter = {
        transaction_details: {
          order_id: `${newPayment.id}-${generateRandomNumber()}`,
          gross_amount: course.price,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: user.profile.name,
          email: user.email,
          phone: user.profile.phone,
        },
      };

      function generateRandomNumber() {
        return Math.floor(Math.random() * 1000000);
      }
  
      let transaction = await snap.createTransaction(parameter);
  
      res.status(201).json({
        status: true,
        message: "",
        data: {
          newPayment,
          token: transaction,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  handlePaymentNotification: async (req, res) => {
    try {
      let notification = {
        currency: req.body.currency,
        fraud_status: req.body.fraud_status,
        gross_amount: req.body.gross_amount,
        order_id: req.body.order_id,
        payment_type: req.body.payment_type,
        status_code: req.body.status_code,
        status_message: req.body.status_message,
        transaction_id: req.body.transaction_id,
        transaction_status: req.body.transaction_status,
        transaction_time: req.body.transaction_time,
        merchant_id: req.body.merchant_id,
      };

      let data = await snap.transaction.notification(notification);

      const updatedPayment = await prisma.order.update({
        where: { id: data.order_id },
        data: {
          status: "Paid",
          payment_method: data.payment_type,
          updatedAt: utils.formattedDate (new Date()),
        },
      });

      res.status(200).json({
        status: true,
        message: "",
        data: { updatedPayment },
      });
    } catch (err) {
      next(err);
=======
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
>>>>>>> kelfin
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
