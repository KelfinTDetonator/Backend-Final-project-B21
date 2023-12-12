const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const {  notification } = require('../models')


module.exports = {
    getAll: async (req, res) => {
        try {
            const allNotif = await prisma.notification.findMany();
            if (allNotif.length === 0) {
                return res.status(200).json({
                  status: 'success',
                  message: 'Data kosong, silahkan isi terlebih dahulu',
                });
              }
    
            return res.status(200).json({
                status: "success",
                notification: allNotif
            });
        } catch (error) {
            res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    getId: async (req, res) => {
        try {
            notifId = req.params.id;

            const allNotif = await prisma.notification.findFirst({
                where:{
                    id: parseInt(notifId)
                }
            });

            return res.status(200).json({
                status: "success",
                notification: allNotif
            });
        } catch (error) {
            res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    delete: async (req, res) => {
        try {
          const { id } = req.params;
      
          const existingNotification = await prisma.notification.findUnique({
            where: {
              id: parseInt(id),
            },
          });
      
          if (!existingNotification) {
            return res.status(404).json({
              status: 'failed',
              message: `Notifikasi dengan ID ${id} tidak ditemukan`,
            });
          }
      
          await prisma.notification.delete({
            where: {
              id: parseInt(id),
            },
          });
      
          return res.status(200).json({
            status: 'success',
            message: `Notifikasi dengan ID ${id} berhasil dihapus`,
          });
        } catch (error) {
          res.status(500).json({
            status: 'failed',
            message: error.message,
          });
        }
    },
    // create: async (req, res) => {
    //     try {
    //         const { title, description } = req.body;
    //         const user = await prisma.user.findFirst({
    //             where: { email },
    //           });
    //         const userId = user.id
            
    //         const newNotification = await prisma.notification.create({
    //             data: {
    //             title,
    //             description,
    //             userId: userId
    //             },
    //         });
        
    //         return res.status(201).json({
    //             status: 'success',
    //             notification: newNotification,
    //         });
    //     } catch (error) {
    //       res.status(500).json({
    //         status: 'failed',
    //         message: error.message,
    //       });
    //     }
    // },
    getByUserId : async (req, res) => {
        try {
          const userId = req.user.id;
      
          const existingUser = await prisma.user.findUnique({
            where: {
              id:userId
            },
          });
      
          if (!existingUser) {
            return res.status(404).json({
              status: 'failed',
              message: `Pengguna dengan ID ${userId} tidak ditemukan`,
            });
          }
      
          const userNotifications = await prisma.notification.findMany({
            where: {
              id: parseInt(userId),
            },
          });
      
          return res.status(200).json({
            status: 'success',
            notifications: userNotifications,
          });
        } catch (error) {
          res.status(500).json({
            status: 'failed',
            message: error.message,
          });
        }
    }
}