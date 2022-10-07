module.exports = (sequelize, DataTypes) => {
  const PaymentConfirmation = sequelize.define(
    "PaymentConfirmation",
    {
      paymentStatus: {
        type: DataTypes.ENUM("WAITING", "PENDING", "APPROVED", "DENIED"),
        defaultValue: "WAITING",
        allowNull: false,
        validate: { notEmpty: true },
      },
      slipImage: {
        type: DataTypes.STRING,
      },
      payeeFirstName: {
        type: DataTypes.STRING,
      },
      payeeLastName: {
        type: DataTypes.STRING,
      },
      payDate: {
        type: DataTypes.DATE,
      },
      payTime: {
        type: DataTypes.TIME,
      },
      payAmount: {
        type: DataTypes.STRING,
      },
    },
    { underscored: true }
  );
  PaymentConfirmation.associate = (db) => {
    PaymentConfirmation.belongsTo(db.Order, {
      foreignKey: {
        name: "OrderId",
        allowNull: false,
        unique: true,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return PaymentConfirmation;
};
