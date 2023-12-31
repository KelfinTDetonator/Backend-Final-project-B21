const { order } = require("../models/index");
const midtrans = require("../utils/midtrans");

module.exports = {
  paySuccess: async (req, res) => {
    const orderIdMidtrans = req.query.order_id;
    const orderId = Number(orderIdMidtrans.split("-")[0]);
    const transactionStatus = req.query.transaction_status;
    // const fraudStatus = req.query.fraud_status;
    const statusCode = Number(req.query.status_code);

    console.log(orderId, transactionStatus, statusCode);

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (statusCode === 200) {
        await order.update({
          where: { id: orderId },
          data: {
            status: "PAID",

          },
        });
        return res.render("success");
      }
    }
  },

  handlePaymentNotification: async (req, res) => {
    try {
      const notification1 = {
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
      console.log(notification1);
      if (req.body.transaction_status === "capture" || req.body.transaction_status === "settlement") {
        if (Number(req.body.status_code) === 200) {
          const data = await midtrans.snap.transaction.notification(notification1);
          const orderId = Number(data.order_id.split("-")[0]);
          const updatedPayment = await order.update({
            where: { id: orderId },
            data: {
              status: "PAID",
              payment_method: data.payment_type,
            },
          });

          return res.status(200).json({
            status: true,
            message: "",
            data: { updatedPayment },
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: true,
        message: err.message,
      });
    }
  },
};
