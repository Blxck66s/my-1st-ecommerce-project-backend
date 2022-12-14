const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");

router.get("/TopProduct/:limit", productController.getTopProduct);
router.get("/", productController.getProduct);
router.get("/byId/:id", productController.getProductById);
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

router.patch(
  "/byId/:id",
  auth,
  upload.single("productImage"),
  productController.updateProduct
);

module.exports = router;
