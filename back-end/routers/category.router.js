const router = require('express').Router();
const categoryController = require('../controllers/category.controller');

router.get('/category/:id', categoryController.getCategory);
router.get('/categories', categoryController.getAllCategory);
router.post('/category', categoryController.createCategory);
router.patch('/category/:id', categoryController.patchCategory);
router.delete('/category/:id', categoryController.deleteCategory);

module.exports = router