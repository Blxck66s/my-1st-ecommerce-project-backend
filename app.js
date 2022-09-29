require("dotenv").config();
const express = require("express");
const app = express();

const { sequelize } = require("./models");
sequelize.sync();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`app server listening on port ${process.env.PORT}`);
});
