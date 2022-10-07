const express = require("express");
const router = express.Router();
const PayConController = require("../controllers/PayConController");
const upload = require("../middlewares/upload");

router.post(
  "/",

  upload.single("slipImage"),
  PayConController.createPayConfirm
);

module.exports = router;
