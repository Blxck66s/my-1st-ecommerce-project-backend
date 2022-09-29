module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      orderStatus: {
        type: DataTypes.ENUM("PENDING", "SUCCESS", "CANCELED"),
        allowNull: false,
        validate: { notEmpty: true },
      },
      sendBy: {
        type: DataTypes.ENUM("EMS", "NORMAL"),
        allowNull: false,
        validate: { notEmpty: true },
      },
      receiverName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      receiverPhone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, isNumeric: true },
      },
      detailedAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      subDistrict: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, isNumeric: true },
      },
      orderTrackingNumber: {
        type: DataTypes.STRING,
      },
    },
    { underscored: true }
  );
  Order.associate = (db) => {
    Order.belongsTo(db.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Order.hasMany(db.OrderItem, {
      foreignKey: {
        name: "OrderId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Order.hasOne(db.PaymentConfirmation, {
      foreignKey: {
        name: "OrderId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Order;
};
