//database
const { Product, sequelize, User } = require("../../models");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

exports.getTopProduct = async (req, res, next) => {
  try {
    const pulledProduct = await sequelize.query(
      `SELECT SUM(oi.amount) as Product_ordered , P.* FROM order_items as oi 
    JOIN Products as P on  oi.product_id = P.id GROUP BY oi.product_id limit 4`
    );
    res.status(200).json({ Product: pulledProduct[0] });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      productCost,
      productPrice,
      stock,
      cpuName,
      mainboardName,
      ramName,
      gpuName,
      driveName,
      caseName,
      psuName,
    } = req.body;
    let productImage = null;

    const userChecked = await User.findOne({ where: { id: req.user.id } });
    if (!userChecked.admin) {
      throw new Error("unauthenticated");
    }
    if (req.file) {
      productImage = await cloudinary.upload(req.file.path);
    }
    const newProduct = await Product.create({
      productName,
      productCost,
      productPrice,
      productImage: productImage ? productImage : null,
      stock,
      cpuName,
      mainboardName,
      ramName,
      gpuName,
      driveName,
      caseName,
      psuName,
    });

    res.status(201).json({ Product: newProduct });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
