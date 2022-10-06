const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");

router.get("/getTopProduct", productController.getTopProduct);
router.post(
  "/createProduct",
  auth,
  upload.single("productImage"),
  productController.createProduct
);

module.exports = router;
