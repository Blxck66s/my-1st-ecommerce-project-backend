//database
const { user } = require("../../models");
const { Op } = require("sequelize");
//validator
const validator = require("validator");
//security
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Generate Token function
const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

exports.register = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
