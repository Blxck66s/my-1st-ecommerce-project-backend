//database
const { User, PaymentConfirmation } = require("../../models");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

exports.createPayConfirm = async (req, res, next) => {
  try {
    const {
      orderId,
      payeeFirstName,
      payeeLastName,
      payDate,
      payTime,
      payAmount,
    } = req.body;
    let slipImage = null;

    const PayChecked = await PaymentConfirmation.findOne({
      where: { OrderId: orderId },
    });
    if (PayChecked) {
      throw new Error("Already Confirmed");
    }
    if (req.file) {
      slipImage = await cloudinary.upload(req.file.path);
    }
    const newPayConfirm = await PaymentConfirmation.create({
      slipImage: slipImage ? slipImage : null,
      paymentStatus: "PENDING",
      OrderId: orderId,
      payeeFirstName,
      payeeLastName,
      payDate,
      payTime,
      payAmount,
    });

    res.status(201).json({ message: "Confirm Success", newPayConfirm });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
