const { order } = require("../models/index");

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
          data: { status: "PAID" },
        });
        return res.render("success");
      }
    }
  },
};
