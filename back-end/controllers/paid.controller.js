const { order } = require("../models/index");

module.exports = {
  paySuccess: async (req, res) => {
    const orderIdMidtrans = req.query.order_id;
    const orderId = orderIdMidtrans.split("-")[0];
    const transactionStatus = req.query.transaction_status;
    const fraudStatus = req.query.fraud_status;
    const statusCode = req.query.status_code;

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "accept" && statusCode === 200) {
        await order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        });
      }
    }
    return res.render("success");
  },
};
