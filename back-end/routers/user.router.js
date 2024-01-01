const express = require("express");

const router = express.Router();
const controller = require("../controllers/user.controller");
const checkRole = require("../middleware/checkRole");
const checkToken = require("../middleware/checkToken");
const passport = require("../utils/passport");
const { googleOauth2 } = require("../controllers/user.controller");

router.delete("/:id", controller.deleteUser);
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

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/google",
    // successRedirect: "https://demyu.vercel.app/",
    session: false,
  }),
  // (req, res) => {
  //   const token = generateToken(req.user);
  //   res.json({ token });
  //   res.redirect("https://demyu.vercel.app/");
  //   console.log(token)
  // },
  googleOauth2,
);

module.exports = router;
