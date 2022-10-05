//database
const { Product, sequelize } = require("../../models");

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
