const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");

router.get("/TopProduct", productController.getTopProduct);
router.get("/", productController.getProduct);
router.get("/total", productController.getTotalProduct);
router.get("/CPU", productController.getCPU);
router.get("/MB", productController.getMB);
router.get("/ram", productController.getram);
router.get("/gpu", productController.getgpu);
router.get("/drive", productController.getdrive);
router.get("/case", productController.getcase);
router.get("/psu", productController.getpsu);

router.post(
  "/",
  auth,
  upload.single("productImage"),
  productController.createProduct
);

module.exports = router;
