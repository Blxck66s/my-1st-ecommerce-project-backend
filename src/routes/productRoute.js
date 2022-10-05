const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/getTopProduct", productController.getTopProduct);

module.exports = router;
