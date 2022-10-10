//database
const { Product, sequelize, User } = require("../../models");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const { Op } = require("sequelize");

exports.getTopProduct = async (req, res, next) => {
  const limit = req.params.limit;
  try {
    const pulledProduct = await sequelize.query(
      `SELECT SUM(oi.amount) as Product_ordered , P.* FROM order_items as oi 
    JOIN Products as P on  oi.product_id = P.id GROUP BY oi.product_id order by Product_ordered desc limit ${+limit}`
    );
    res.status(200).json({ Product: pulledProduct[0] });
  } catch (err) {
    next(err);
  }
};

exports.getTotalProduct = async (req, res, next) => {
  try {
    const pulledTotal = await Product.count();
    res.status(200).json({ Product: pulledTotal });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const pageNo = +req.query.page || 1;
  const pageLimit = +req.query.limit || 5;
  const pageOffset = 0 + (pageNo - 1) * pageLimit;

  const sort = req.query.sort || "createdAt";
  const updown = req.query.updown || "DESC";
  const cpu = req.query.cpu.trim() || "";
  const mainboard = req.query.mainboard.trim() || "";
  const ram = req.query.ram.trim() || "";
  const gpu = req.query.gpu.trim() || "";
  const drive = req.query.drive.trim() || "";
  const caseN = req.query.caseN.trim() || "";
  const psu = req.query.psu.trim() || "";

  try {
    const pulledProduct = await Product.findAll({
      offset: pageOffset,
      limit: pageLimit,
      order: [[sort, updown]],
      where: {
        cpuName: { [Op.like]: "%" + cpu + "%" },
        mainboardName: { [Op.like]: "%" + mainboard + "%" },
        ramName: { [Op.like]: "%" + ram + "%" },
        gpuName: { [Op.like]: "%" + gpu + "%" },
        driveName: { [Op.like]: "%" + drive + "%" },
        caseName: { [Op.like]: "%" + caseN + "%" },
        psuName: { [Op.like]: "%" + psu + "%" },
      },
    });
    res.status(200).json({ Product: pulledProduct });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const pulledProduct = await Product.findOne({
      where: { id: productId },
    });

    res.status(200).json({ Product: pulledProduct });
  } catch (err) {
    next(err);
  }
};

exports.getCPU = async (req, res, next) => {
  try {
    const pulledCPU = await Product.findAll({
      attributes: ["cpuName"],
      group: "cpuName",
    });

    res.status(200).json({ CPU: pulledCPU });
  } catch (err) {
    next(err);
  }
};

exports.getMB = async (req, res, next) => {
  try {
    const pulledMB = await Product.findAll({
      attributes: ["mainboardName"],
      group: "mainboardName",
    });

    res.status(200).json({ mainboard: pulledMB });
  } catch (err) {
    next(err);
  }
};
exports.getram = async (req, res, next) => {
  try {
    const pulledram = await Product.findAll({
      attributes: ["ramName"],
      group: "ramName",
    });

    res.status(200).json({ ram: pulledram });
  } catch (err) {
    next(err);
  }
};
exports.getgpu = async (req, res, next) => {
  try {
    const pulledgpu = await Product.findAll({
      attributes: ["gpuName"],
      group: "gpuName",
    });

    res.status(200).json({ gpu: pulledgpu });
  } catch (err) {
    next(err);
  }
};
exports.getdrive = async (req, res, next) => {
  try {
    const pulleddrive = await Product.findAll({
      attributes: ["driveName"],
      group: "driveName",
    });

    res.status(200).json({ drive: pulleddrive });
  } catch (err) {
    next(err);
  }
};
exports.getcase = async (req, res, next) => {
  try {
    const pulledcase = await Product.findAll({
      attributes: ["caseName"],
      group: "caseName",
    });

    res.status(200).json({ caseN: pulledcase });
  } catch (err) {
    next(err);
  }
};
exports.getpsu = async (req, res, next) => {
  try {
    const pulledpsu = await Product.findAll({
      attributes: ["psuName"],
      group: "psuName",
    });

    res.status(200).json({ psu: pulledpsu });
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
      stock: stock ? stock : 1,
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

exports.updateProduct = async (req, res, next) => {
  try {
    const ProductId = req.params.id;
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

    if (req.file) {
      productImage = await cloudinary.upload(req.file.path);
    }

    const adminChecked = await User.findOne({ where: { id: req.user.id } });
    if (!adminChecked.admin) {
      throw new Error("unauthorized");
    }

    await Product.update(
      {
        productName,
        productCost,
        productPrice,
        productImage,
        stock,
        cpuName,
        mainboardName,
        ramName,
        gpuName,
        driveName,
        caseName,
        psuName,
      },
      { where: { id: ProductId } }
    );

    res.status(200).json({ message: "update done" });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
