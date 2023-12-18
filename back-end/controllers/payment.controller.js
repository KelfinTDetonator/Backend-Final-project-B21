const midtrans = require("../utils/midtrans");
const { order } = require("../models/index");

module.exports = {
  payment: async (req, res) => {
    // const userId = req.user.id;
    const userId = Number(req.params.id);
    const orderData = await order.findFirst({
      where: {
        status: "UNPAID",
        userId,
      },
    });
    const parameters = {
      transaction_details: {
        order_id: orderData.id,
        gross_amount: Number(orderData.total_price),
      },
      credit_card: {
        secure: true,
      },
    };
    const { token, redirect_url } = await midtrans.snap.createTransaction(parameters);
    res.render("payment", {
      token,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
  },

};
