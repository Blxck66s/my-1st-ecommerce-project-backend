//database
const { Op } = require("sequelize");
const {
  Order,
  OrderItem,
  PaymentConfirmation,
  Product,
  User,
  sequelize,
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
          model: User,
          attributes: ["firstName", "mobile"],
        },
        {
          model: PaymentConfirmation,
        },
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

exports.createOrder = async (req, res, next) => {
  try {
    const {
      receiverName,
      receiverPhone,
      detailedAddress,
      subDistrict,
      district,
      province,
      postalCode,
      sendBy,
      item,
      itemAmount,
    } = req.body;

    const userChecked = await User.findOne({ where: { id: req.user.id } });
    if (!userChecked) {
      throw new Error("unauthenticated");
    }

    const productStockChecked = await Product.findOne({ where: { id: item } });

    if (+productStockChecked.stock < itemAmount) {
      throw new Error("out of stock");
    }
    await Product.update(
      { stock: +productStockChecked.stock - itemAmount },
      { where: { id: item } }
    );

    const newOrder = await Order.create({
      receiverName,
      receiverPhone,
      detailedAddress,
      subDistrict,
      district,
      province,
      postalCode,
      orderStatus: "PENDING",
      sendBy,
      orderTotal:
        sendBy === "EMS"
          ? productStockChecked.productPrice * itemAmount + 1000
          : sendBy === "Normal"
          ? productStockChecked.productPrice * itemAmount + 300
          : 0,
      userId: req.user.id,
    });

    const newOrderItem = await OrderItem.create({
      ProductId: item,
      amount: itemAmount,
      productCost: productStockChecked.productCost,
      productPrice: productStockChecked.productPrice,

      OrderId: newOrder.id,
    });

    res.status(201).json({ order: newOrder });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  if (!req.user.admin) {
    throw new Error("unauthorized");
  }
  try {
    const pulledOrders = await Order.findAll({
      include: [{ model: PaymentConfirmation }],
    });
    res.status(200).json({ Order: pulledOrders });
  } catch (err) {
    next(err);
  }
};

exports.getOrderCount = async (req, res, next) => {
  if (!req.user.admin) {
    throw new Error("unauthorized");
  }
  try {
    const pulledOrders = await sequelize.query(
      "SELECT CAST(created_at AS DATE) as date,COUNT(id) as totalOrdered FROM `orders` AS `Order` GROUP BY CAST(created_at AS DATE)"
    );
    res.status(200).json({ Order: pulledOrders[0] });
  } catch (err) {
    next(err);
  }
};

exports.getOrderItems = async (req, res, next) => {
  if (!req.user.admin) {
    throw new Error("unauthorized");
  }
  try {
    const pulledOrderItems = await OrderItem.findAll({});

    res.status(200).json({ OrderItem: pulledOrderItems });
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const OrderId = req.params.id;
    const { orderStatus, orderTrackingNumber, paymentStatus } = req.body;

    const adminChecked = await User.findOne({ where: { id: req.user.id } });
    if (!adminChecked.admin) {
      throw new Error("unauthorized");
    }

    await Order.update(
      {
        orderStatus,
        orderTrackingNumber,
      },
      { where: { id: OrderId } }
    );

    await PaymentConfirmation.update(
      {
        paymentStatus,
      },
      { where: { OrderId } }
    );

    res.status(200).json({ message: "update done" });
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const OrderId = req.params.id;

    const adminChecked = await User.findOne({ where: { id: req.user.id } });
    if (!adminChecked.admin) {
      throw new Error("unauthorized");
    }

    const updatedPaymentConfirmation = await PaymentConfirmation.destroy({
      where: { OrderId },
    });

    const updatedOrderItems = await OrderItem.destroy({
      where: { OrderId },
    });

    const updatedOrder = await Order.destroy({
      where: { id: OrderId },
    });

    res.status(200).json({ message: "delete done" });
  } catch (err) {
    next(err);
  }
};
