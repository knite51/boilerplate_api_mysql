/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/
require('dotenv').config();

const Sequelize = require('sequelize');
const { NODE_ENV } = process.env;
const dbConfig = require('./../config/_index');
const config = dbConfig[NODE_ENV];

module.exports = {
  sequelize: new Sequelize(config.url, config),
  async connect() {
    try {
      try {
        await this.sequelize.authenticate();
        console.log(`Database connection established.`);
      } catch (error) {
        console.log(`Could not connect to database ${error}`);
      }
    } catch (e) {
      console.log(`[DB Error]: ${e}`);
    }
  },
};
