const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const {  user, profile } = require('../models')
const utils = require('../utils/index.js')
const imageKit = require('../utils/index.js')


module.exports = {
  create: async (req, res, next) => {
    try {
      const {
        name, phone, city, nationality, profile_picture,
      } = req.body;
      const fileTostring = req.file.buffer.toString("base64");

      const uploadFile = await utils.imageKit.upload({
        fileName: req.file.originalname,
        file: fileTostring,
      });

            const profiles = await profile.create({
                data: {
                    name, 
                    phone,
                    city,
                    nationality, 
                    profile_picture: uploadFile.url
                }
            })

            return res.status(201).json({
                profiles
            })

        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            let { name, phone, city, nationality, profile_picture} = req.body;
            const fileTostring = req.file.buffer.toString('base64');

            const userId = req.user.id; 
            const uploadFile = await utils.imageKit.upload({
                fileName: req.file.originalname,
                file: fileTostring
            });

            const profiles = await profile.update({
                where: {
                    id: userId
                },
                data: {
                    name, 
                    phone,
                    city,
                    nationality, 
                    profile_picture: uploadFile.url
                }
            })

            return res.status(200).json({
                profiles
            })

        } catch (error) {
            next(error)
        }
    },
    getId: async (req, res) => {
        try {
            const getProfile = await profile.findUnique({
                where: {
                    id: parseInt(req.params.id)
                },
                include: {
                    user: true
                }
            })
            if(!getProfile){
                return res.status(404).json({
                    status: 'failed',
                    message: `Pengguna dengan ID ${id} tidak ditemukan`
                });
            }
            return res.status(200).json({
                status: "succes",
                getProfile
            })

            
            
        } catch (error) {
            res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    getAll: async (req, res) => {
        try {
            const allProfiles = await profile.findMany({
                include: {
                    user: true
                }
            });
    
            return res.status(200).json({
                status: "success",
                profiles: allProfiles
            });
        } catch (error) {
            res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    delete: async (req, res, next) => {
        try {

            const existingUser = await prisma.profile.findUnique({
                where: {
                  id: parseInt(id)
                }
              });
            if (!existingUser) {
            return res.status(404).json({
                status: 'failed',
                message: `Pengguna dengan ID ${id} tidak ditemukan`
            });
            }

            const profiles = await profile.delete({
                where: {
                    id: parseInt(req.user.id)
                }
            })
            await user.delete({
                where: {
                  id: parseInt(id)
                }
              });

      res.status(200).json({
        status: "success",
        message: `Pengguna dengan ID ${id} berhasil dihapus`,
      });
    } catch (error) {
      next(error);
    }
  },
};
