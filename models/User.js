module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      email: {
        type: DataTypes.STRING,
        validate: { isEmail: true },
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isNumeric: true, notEmpty: true },
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isAlphanumeric: true, len: [6, 30], notEmpty: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    { underscored: true }
  );
  User.associate = (db) => {
    User.hasMany(db.Order, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return User;
};
