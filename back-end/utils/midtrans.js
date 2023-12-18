require("dotenv").config();
const midtransClient = require("midtrans-client");

module.exports = {
  snap: new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  }),
};
