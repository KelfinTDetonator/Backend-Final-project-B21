require("dotenv").config();
const ImageKit = require("imagekit");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const {
  GOOGLE_REFRESH_TOKEN, MAILER_EMAIL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SMTP_PASS, SMTP_USER,
} = process.env;
const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

module.exports = {
  sendEmail: async (to, subject, text) => {
    // const accesToken = await oauth2Client.getAccessToken();

    // const transport = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     type: "OAuth2",
    //     user: MAILER_EMAIL,
    //     clientId: GOOGLE_CLIENT_ID,
    //     clientSecret: GOOGLE_CLIENT_SECRET,
    //     refreshToken: GOOGLE_REFRESH_TOKEN,
    //     accessToken: accesToken,
    //   },
    // });

    // transport.sendMail({ to, subject, text });
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: SMTP_USER,
      to,
      subject,
      text,
    };

    await new Promise((resolve, reject) => {
      transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });
  },
  imageKit:
    // eslint-disable-next-line no-new
    new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_SECRET_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    }),

  getVideoDuration: async (arrayDB) => {
    const sum = (total, val) => { // get duration from a video url
      // const videoDuration = await getVideoDurationInSeconds(val.video_url);
      // totalTime = await total + videoDuration;
      const videoDuration = val.duration;
      return total + videoDuration;
    };

    let duration = await arrayDB.reduce(sum, 0);

    /* if duration <= 60 seconds then round the number. if duration >= 60, convert into minutes */
    duration = (duration <= 60) ? Math.round(duration) : (Math.round(duration / 60));

    return duration;
  },

  // midtrans config

};
