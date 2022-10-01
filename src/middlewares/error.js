module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.message === "unauthenticated") {
    err.message = err.message + " : none shall pass !!~";
    err.statusCode = 401;
  }
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    err.message = err.errors[0].message;

    err.statusCode = 400;
  }
  if (err.name === "TokenExpieredError" || err.name === "JsonWebTokenError") {
    err.statusCode = 401;
  }
  if (
    err.message === "username is invalid" ||
    err.message === "password is invalid" ||
    err.message === "this username doesnt exist" ||
    err.message === "password is invalid"
  ) {
    err.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({ message: err.message });
};
