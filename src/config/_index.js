require('dotenv').config();
const Op = require('sequelize');

const operatorsAliases = [Op.or, Op.regexp];

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    operatorsAliases,
    dialect: 'mysql'
  },
  production: {
    url: process.env.PROD_DATABASE_URL,
    operatorsAliases,
    dialect: 'mysql'
  },
  deploying: {
    url: process.env.DATABASE_URL,
    operatorsAliases,
    dialect: 'postgres'
  }
};
