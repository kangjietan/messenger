require("dotenv").config();
const { Sequelize } = require('sequelize');

const db = new Sequelize("messenger", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_URL,
  dialect: "postgres",
});

module.exports = db;
