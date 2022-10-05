//database
const { Op } = require("sequelize");
const {
  Order,
  OrderItem,
  PaymentConfirmation,
  Product,
  User,
} = require("../../models");

exports.getOrder = async (req, res, next) => {
  try {
    const pulledOrders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: PaymentConfirmation,
        },
      ],
    });
    res.status(200).json({ Order: pulledOrders });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const pulledOrder = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
            },
          ],
        },
      ],
    });
    res.status(200).json({ Order: pulledOrder });
  } catch (err) {
    next(err);
  }
};

exports.getOrderPaymentConfirmByOrderId = async (req, res, next) => {
  const OrderId = req.params.id;
  try {
    const pulledOrderPaymentConfirm = await PaymentConfirmation.findOne({
      where: { OrderId },
    });
    res.status(200).json({ PaymentConfirmation: pulledOrderPaymentConfirm });
  } catch (err) {
    next(err);
  }
};
