const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/getuser", auth, authController.getUser);

module.exports = router;
