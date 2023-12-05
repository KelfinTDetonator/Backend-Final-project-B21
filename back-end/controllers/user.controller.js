const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { user, profile } = require("../models");

const nodemailer = require("../utils/index");

function AddSecondsToDate(date, seconds) {
  return new Date(date.getTime() + seconds * 1000);
}

const generateResetToken = () => {
  const token = crypto.randomBytes(20).toString("hex");
  return token;
};

module.exports = {
  register: async (req, res, next) => {
    try {
      const {
        email, password, role, name, phone,
      } = req.body;

      const existingUser = await user.findFirst({
        where: { email },
      });

      if (existingUser) {
        return res.status(500).json({
          status: "failed",
          message: `Email ${email} sudah ada`,
        });
      }
      const encryptedPassword = await bcrypt.hash(password, 10);
      const newUser = await user.create({
        data: {
          email,
          password: encryptedPassword,
          role,
        },
      });

      const userProfile = await profile.create({
        data: {
          name,
          phone,
          userId: newUser.id,
        },
      });

      const userId = newUser.id;

      const generatedOTP = () => {
        const digit = "0123456789";
        let OTP = "";
        for (let i = 1; i <= 6; i++) {
          OTP += digit[Math.floor(Math.random() * 10)];
        }
        return OTP;
      };

      const otp = generatedOTP();

      await user.update({
        where: {
          id: userId,
        },
        data: {
          otp,
          // expiration_time: AddMinutesToDate(new Date(), 10)
          expiration_time: AddSecondsToDate(new Date(), 30),
        },
      });

      // let token = jwt.sign({ email: newUser.email }, JWT_SECRET_KEY);
      nodemailer.sendEmail(email, "Email Activation", `ini adalah otp anda ${otp}`);
      res.status(200).json({
        status: "success",
        message: "Anda Berhasil Registrasi",
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const userData = await user.findFirst({
        where: { email },
      });

      if (!userData) {
        return res.status(404).json({
          status: "failed",
          message: "User tidak ditemukan",
        });
      }

      // Verifikasi password
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (!passwordMatch) {
        return res.status(401).json({
          status: "failed",
          message: "Password salah",
        });
      }

      // Periksa status verifikasi
      if (!userData.verified) {
        return res.status(403).json({
          status: "failed",
          message: "Akun belum diverifikasi",
        });
      }

      const token = jwt.sign(
        {
          userId: userData.id,
          email: userData.email,
          role: userData.role,
        },
        "secretKey",
        { expiresIn: "1h" },
      );

      res.status(200).json({
        status: "success",
        message: "Login berhasil",
        user: {
          id: userData.id,
          email: userData.email,
          role: userData.role,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      // Ambil semua pengguna dari basis data
      const allUsers = await user.findMany();

      if (allUsers.length === 0) {
        return res.status(200).json({
          status: "success",
          message: "Data kosong, silahkan isi terlebih dahulu",
        });
      }

      res.status(200).json({
        status: "success",
        user: allUsers,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  verify: async (req, res) => {
    try {
      const { otp } = req.body;
      const existingUser = await user.findFirst();
      const userId = existingUser.id;

      if (existingUser) {
        if ((existingUser.otp === otp)
        && (Date.parse(existingUser.expiration_time)
        > Date.parse(new Date()))) {
          await user.update({
            where: {
              id: userId,
              email: existingUser.email,
            },
            data: {
              verified: true,
            },
          });
          // await prisma.user.update({
          //   where: {
          //     email: existingUser.email,
          //   },
          //   data: {
          //     verified: true,
          //   },
          // });
          res.status(200).json({
            status: "success",
            message: "Anda Berhasil Verifikasi",
          });
        } else {
          res.status(409).json({
            status: "failed",
            message: "Periksa kembali otp anda",
          });
        }
      } else {
        res.status(500).json({
          status: "failed",
          message: "Email tidak terdaftar",
        });
      }
    } catch (err) {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    }
  },
  otp: async (req, res) => {
    try {
      const { email } = req.body;

      const Email = await user.findFirst({ //! !
        where: {
          email,
        },
      });
      console.log(Email);
      if (Email === null) {
        return res.status(500).json({
          status: "failed",
          message: `Email ${email} tidak ada`,
        });
      }

      const generatedOTP = () => {
        const digit = "0123456789";
        let OTP = "";
        for (let i = 1; i <= 6; i++) {
          OTP += digit[Math.floor(Math.random() * 10)];
        }
        return OTP;
      };

      const otp = generatedOTP();

      await user.update({
        where: {
          id: Email.id, //! ! !
        },
        data: {
          otp,
          expiration_time: AddSecondsToDate(new Date(), 10),
        },
      });
      await nodemailer.sendEmail(email, "Email Activation", `ini adalah otp anda ${otp}`);
      // todo:
      return res.status(200).json({ message: "200 OK" });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const existingUser = await user.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!existingUser) {
        return res.status(404).json({
          status: "failed",
          message: `Pengguna dengan ID ${id} tidak ditemukan`,
        });
      }
      await profile.delete({
        where: {
          id: parseInt(id),
        },
      });
      await user.delete({
        where: {
          id: parseInt(id),
        },
      });

      res.status(200).json({
        status: "success",
        message: `Pengguna dengan ID ${id} berhasil dihapus`,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const userWithProfile = await user.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          profile: true,
        },
      });

      if (!userWithProfile) {
        return res.status(404).json({
          status: "failed",
          message: `Pengguna dengan ID ${id} tidak ditemukan`,
        });
      }

      res.status(200).json({
        status: "success",
        data: userWithProfile,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  forgetPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      const userData = await user.findFirst({
        where: { email },
      });

      if (!userData) {
        return res.status(404).json({
          status: "failed",
          message: "Email tidak terdaftar",
        });
      }

      const resetToken = generateResetToken();

      await user.update({
        where: {
          id: userData.id,
        },
        data: {
          reset_password_token: resetToken,
        },
      });

      const resetLink = `localhost:3000/reset-password?token=${resetToken}`;

      nodemailer.sendEmail(email, "Email Activation", `silahkan klik link berikut ini untuk mengganti password ${resetLink}`);

      res.status(200).json({
        status: "success",
        message: "link reset password telah dikirim melalui email",
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  insertPassword: async (req, res, next) => {
    try {
      const { newPassword, confirm_password } = req.body;
      const { token } = req.query;

      const userData = await user.findFirst({
        where: {
          reset_password_token: token,
        },
      });

      if (!userData) {
        return res.status(404).json({
          status: "failed",
          message: "Token reset password tidak valid atau telah kadaluarsa",
        });
      }

      const encryptedPassword = await bcrypt.hash(newPassword, 10);

      await user.update({
        where: {
          id: userData.id,
        },
        data: {
          password: encryptedPassword,
          reset_password_token: token,
        },
      });

      res.status(200).json({
        status: "success",
        message: "Password berhasil direset",
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  },

};
