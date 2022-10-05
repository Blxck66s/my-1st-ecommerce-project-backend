const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middlewares/auth");

router.get("/getorder", auth, orderController.getOrder);
router.get("/getorder/:id", auth, orderController.getOrderById);
router.get(
  "/getorderPC/:id",
  auth,
  orderController.getOrderPaymentConfirmByOrderId
);

module.exports = router;
