module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      amount: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      productCost: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      productPrice: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
    },
    { underscored: true }
  );
  OrderItem.associate = (db) => {
    OrderItem.belongsTo(db.Order, {
      foreignKey: {
        name: "OrderId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    OrderItem.belongsTo(db.Product, {
      foreignKey: {
        name: "ProductId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return OrderItem;
};
