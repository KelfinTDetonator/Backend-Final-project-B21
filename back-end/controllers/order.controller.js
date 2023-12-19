const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const midtransClient = require("midtrans-client");
const { order, course, user, profile } = require("../models/index");
const { PAYMENT_SERVER_KEY } = process.env;
const utils = require('../utils/index')

module.exports = {
  createPayment: async (req, res, next) => {
    try {
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
