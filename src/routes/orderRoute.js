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
router.post("/", auth, orderController.createOrder);
router.patch("/order/:id", auth, orderController.updateOrder);
router.delete("/order/:id", auth, orderController.deleteOrder);

router.get("/gettotalorder", auth, orderController.getOrderCount);
router.get("/getorders", auth, orderController.getOrders);
router.get("/getorderitems", auth, orderController.getOrderItems);

module.exports = router;
