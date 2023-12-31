const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
// nodemailer = require('nodemailer')
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const nodemailer = require("../utils/index");

function AddMinutesToDate(date, minutes, seconds) {
  return new Date(date.getTime() + minutes * 60000);
  // return new Date(date.getTime() + seconds * 1000);
}
// function AddSecondsToDate(date, seconds) {
//   return new Date(date.getTime() + seconds * 1000);
// }

const generateResetToken = () => {
  const token = crypto.randomBytes(20).toString("hex");
  return token;
};

module.exports = {
  register: async (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(2).required().label("name"),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com"] } }).required().label("email"),
      password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).{8,}$/, "password").required(),
      phone: Joi.string().pattern(/^(^\+62\s?|^0)(\d{10,14})$/).required().label("phone"),
      role: Joi.valid("admin", "user"),
    });
    const val = schema.validate(req.body);

    if (!(val.error)) {
      if (!req.body.password) {
        return res.status(400).json({
          status: "failed",
          message: "Password wajib diisi",
        });
      }
      try {
        const {
          email, password, role, name, phone,
        } = val.value;

        const existingUser = await prisma.user.findFirst({
          where: { email },
        });

        if (existingUser) {
          return res.status(500).json({
            status: "failed",
            message: `Email ${email} sudah ada`,
          });
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
          data: {
            email,
            password: encryptedPassword,
            role,
          },
        });

        const userProfile = await prisma.profile.create({
          data: {
            name,
            phone,
            userId: newUser.id,
          },
        });

        const userId = newUser.id;

        const notif = await prisma.notification.create({
          data: {
            title: "Berhasil Regitrasi",
            description: "Selamat datang di website kami",
            userId,
          },
        });

        const generatedOTP = () => {
          const digit = "0123456789";
          let OTP = "";
          for (let i = 1; i <= 6; i++) {
            OTP += digit[Math.floor(Math.random() * 10)];
          }
          return OTP;
        };

        const otp = generatedOTP();

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            otp,
            expiration_time: AddMinutesToDate(new Date(), 5),
            // expiration_time: AddSecondsToDate(new Date(), 30),
          },
        });

        // let token = jwt.sign({ email: newUser.email }, JWT_SECRET_KEY);
        nodemailer.sendEmail(email, "Email Activation", `ini adalah otp anda ${otp}`);
        res.status(200).json({
          status: "success",
          message: "Anda berhasil registrasi, silahkan cek email anda untuk verifikasi",
        });
      } catch (err) {
        next(err);
        // return res.status(500).json({
        //   status: 'failed',
        //   message: 'Gagal mengirim email verifikasi. Silahkan coba lagi nanti.'
        // });
      }
    } else {
      const { message } = val.error.details[0];
      res.status(400).json({
        status: "failed",
        message,
      });
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const loginUser = await prisma.user.findFirst({
        where: { email },
      });

      const loginId = loginUser.id;

      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User tidak ditemukan",
        });
      }

      // Verifikasi password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          status: "failed",
          message: "Password salah",
        });
      }

      // Periksa status verifikasi
      if (!user.verified) {
        return res.status(403).json({
          status: "failed",
          message: "Akun belum diverifikasi",
        });
      }

      const notif = await prisma.notification.create({
        data: {
          title: "Berhasil login",
          description: "Selamat anda berhasil login",
          userId: loginId,
        },
      });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        "secretKey",
        { expiresIn: "1h" },
      );

      res.status(200).json({
        status: "success",
        message: "Login berhasil",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
        notif,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  loginAdmin: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const loginUser = await prisma.user.findFirst({
        where: { email },
      });

      const loginId = loginUser.id;

      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User tidak ditemukan",
        });
      }

      if (user.role != "admin") {
        return res.status(403).json({
          status: "failed",
          message: "anda bukan admin",
        });
      }

      // Verifikasi password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          status: "failed",
          message: "Password salah",
        });
      }

      // Periksa status verifikasi
      if (!user.verified) {
        return res.status(403).json({
          status: "failed",
          message: "Akun belum diverifikasi",
        });
      }

      const notif = await prisma.notification.create({
        data: {
          title: "Berhasil login",
          description: "Selamat anda berhasil login",
          userId: loginId,
        },
      });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        "secretKey",
        { expiresIn: "1h" },
      );

      res.status(200).json({
        status: "success",
        message: "Login berhasil",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
        notif,
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
      const allUsers = await prisma.user.findMany();

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
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  verify: async (req, res) => {
    try {
      const { otp } = req.body;
      const existingUser = await prisma.user.findFirst({
        where: { otp },
      });
      const userId = existingUser.id;
      if (existingUser) {
        if ((existingUser.otp === otp) && (Date.parse(existingUser.expiration_time) > Date.parse(new Date()))) {
          await prisma.user.update({
            where: {
              id: userId,
              email: existingUser.email,
            },
            data: {
              verified: true,
            },
          });
          const notif = await prisma.notification.create({
            data: {
              title: "Berhasil Verifikasi",
              description: "Selamat anda berhasil verifikasi",
              userId,
            },
          });
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

      const Email = await prisma.user.findFirst({
        where: {
          email,
        },
      });

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

      await prisma.user.update({
        where: {
          id: Email.id,
        },
        data: {
          otp,
          expiration_time: AddMinutesToDate(new Date(), 10),
        },
      });
      await nodemailer.sendEmail(email, "Email Activation", `ini adalah otp anda ${otp}`);
      return res.status(200).json({ error: false, message: "Email Activation berhasil!" });
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

      const existingUser = await prisma.user.findUnique({
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
      const existingProfile = await prisma.profile.findUnique({
        where: {
          userId: parseInt(id),
        },
      });

      const existingNotifications = await prisma.notification.findMany({
        where: {
          userId: parseInt(id),
        },
      });

      // Hapus notifikasi jika ada
      if (existingNotifications.length > 0) {
        await prisma.notification.deleteMany({
          where: {
            userId: parseInt(id),
          },
        });
      }

      if (existingProfile) {
        await prisma.profile.delete({
          where: {
            userId: parseInt(id),
          },
        });
      }
      await prisma.user.delete({
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
      const { id } = req.user;

      const userWithProfile = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          profile: true,
          order: true,
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

      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "Email tidak terdaftar",
        });
      }

      const resetToken = generateResetToken();

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          reset_password_token: resetToken,
        },
      });

      const resetLink = `https://demyu.vercel.app/auth/resetpassword?token=${resetToken}`;

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
      const { newPassword, confirmPassword } = req.body;
      const { token } = req.query;

      const user = await prisma.user.findFirst({
        where: {
          reset_password_token: token,
        },
      });

      if (!newPassword || !confirmPassword) {
        return res.status(400).json({
          status: "failed",
          message: "Semua kolom harus diisi",
        });
      } if
      (newPassword !== confirmPassword) {
        return res.status(400).json({
          status: "failed",
          message: "Password baru dan konfirmasi password tidak cocok",
        });
      } if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "Token reset password tidak valid atau telah kadaluarsa",
        });
      }

      const encryptedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: encryptedPassword,
          reset_password_token: token,
        },
      });

      const notif = await prisma.notification.create({
        data: {
          title: "Berhasil Reset Password",
          description: "Anda berhasil mengganti password",
          userId: user.id,
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
  updatePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const userId = req.user.id;

      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          status: "failed",
          message: "Semua kolom harus diisi",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          status: "failed",
          message: "Password baru dan konfirmasi password tidak cocok",
        });
      }
      const user_id = await prisma.user.findUnique({
        where: { id: userId },
      });

      const isPasswordMatch = await bcrypt.compare(oldPassword, user_id.password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          status: "failed",
          message: "Password lama tidak benar",
        });
      }

      const encryptedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: {
          password: encryptedPassword,
        },
      });

      const notif = await prisma.notification.create({
        data: {
          title: "Berhasil Reset Password",
          description: "Anda berhasil mengganti password",
          userId,
        },
      });

      res.status(200).json({
        status: "success",
        message: "Password berhasil direset",
      });
    } catch (error) {
      next(error);
    }
  },
  googleOauth2: (req, res) => {
    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ id: req.user.id }, "secretKey");

    return res.status(200).json({
      status: true,
      message: "OK",
      err: null,
      data: { user: req.user, token },
    });
  },
};
