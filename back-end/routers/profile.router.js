const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/profile.controller'),
    multer = require('multer');
    checkToken = require('../middleware/checkToken');

const storage = multer.memoryStorage(); // Menggunakan memory storage untuk menyimpan file sementara
const upload = multer({ storage: storage });

router.post('/', upload.single('profile_picture'),controller.create)
router.put('/:id', upload.single('profile_picture'),controller.update)
router.get('/:id', controller.getId)
router.delete('/:id', controller.delete)
router.get('/', controller.getAll)

module.exports = router