const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { GOOGLE_REFRESH_TOKEN, MAILER_EMAIL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });



module.exports= {
  sendEmail: async (to, subject, text) => {
    const accesToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: MAILER_EMAIL,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken: accesToken,
      },
    });
  
    transport.sendMail({ to, subject, text});
  }
}