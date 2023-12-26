const express = require("express");

<<<<<<< HEAD
router.delete('/:id', controller.deleteUser)
router.get('/',checkToken, checkRole(["admin", "user"]),controller.getAllUsers)
router.get('/:id', controller.getById)
router.post('/otp', controller.otp)
router.post('/verify', controller.verify)
router.post('/', controller.register)
router.post('/login', controller.login)
router.post('/forget-password', controller.forgetPassword)
router.post('/insert-password', controller.insertPassword)
router.post('/update-password',checkToken, checkRole(["admin", "user"]), controller.updatePassword)
router.post('/admin', controller.loginAdmin)

module.exports = router
=======
const router = express.Router();
const controller = require("../controllers/user.controller");
const checkRole = require("../middleware/checkRole");
const checkToken = require("../middleware/checkToken");

router.delete("/:id", controller.deleteUser);
// router.get("/", controller.getAllUsers);
router.get("/", checkToken, checkRole(["admin", "user"]), controller.getAllUsers);
router.get("/:id", controller.getById);
router.post("/otp", controller.otp);
router.post("/verify", controller.verify);
router.post("/", controller.register);
router.post("/login", controller.login);
router.post("/forget-password", controller.forgetPassword);
router.post("/insert-password", controller.insertPassword);
router.post("/update-password", checkToken, checkRole(["admin", "user"]), controller.updatePassword);
router.post("/admin", controller.loginAdmin);

module.exports = router;
>>>>>>> kelfin
