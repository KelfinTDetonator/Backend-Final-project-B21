const midtrans = require("../utils/midtrans");
const {
  order, course, profile, user,
} = require("../models/index");

module.exports = {
  payment: async (req, res) => {
    const userId = (req.user) ? req.user.id : Number(req.params.id);
    // const userId = ;
    const orderData = await order.findFirst({
      where: {
        status: "UNPAID",
        userId,
      },
    });

    if (!orderData) { return res.status(404).json({ error: true, message: "Order data not found!" }); }

    const courseItemData = await course.findUnique({
      where: { id: orderData.courseId },
    });
    courseItemData.quantity = 1;
    const customer = await profile.findUnique({
      where: { userId: orderData.userId },
    });
    const userData = await user.findUnique({ where: { id: orderData.userId } });
    const date = Date.now();
    const orderDate = `${orderData.id}-${date.valueOf()}`;
    const parameters = {
      transaction_details: {
        order_id: orderDate,
        gross_amount: Number(orderData.total_price),
      },
      item_details: [
        courseItemData,
      ],
      customer_details: {
        name: customer.name,
        email: userData.email,
        phone: customer.phone,
      },
      credit_card: {
        secure: true,
      },
    };
    const { token, redirect_url } = await midtrans.snap.createTransaction(parameters);
    return res.render("payment", {
      token,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
    // return res.status(200).json({
    //   error: false,
    //   midtrans_token: token,
    //   midtrans_clientKey: process.env.MIDTRANS_CLIENT_KEY,
    // });
  },

};
