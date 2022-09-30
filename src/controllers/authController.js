//database
const { User } = require("../../models");
const { Op } = require("sequelize");
//security
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  //request
  try {
    const { firstName, lastName, email, mobile, username, password } = req.body;

    //security
    const hashedPassword = await bcrypt.hash(password, 10);
    //database created
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      username,
      password: hashedPassword,
    });
    //token created
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    //response
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    //request
    const { username, password } = req.body;
    //validate
    if (typeof username !== "string") {
      throw new Error("username is invalid", 400);
    }
    if (typeof password !== "string") {
      throw new Error("password is invalid", 400);
    }
    //find user
    const pulledUser = await User.findOne({
      where: { username },
    });
    //if user doesnt match database
    if (!pulledUser) {
      throw new Error("this username doesnt exist", 400);
    }
    //if user password doesnt match database
    const isPasswordMatch = await bcrypt.compare(password, pulledUser.password);
    if (!isPasswordMatch) {
      throw new Error("username or password is invalid", 400);
    }
    //token created
    const token = jwt.sign({ id: pulledUser.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    //response
    res.status(200).json({
      token,
      firstName: pulledUser.firstName,
      lastName: pulledUser.lastName,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
};
