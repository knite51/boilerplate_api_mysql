/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/
const Sequelize = require('sequelize');
require('dotenv').config();

const { resolve } = require('path');
const glob = require('glob');

const basePath = resolve(__dirname, '../models/');
const files = glob.sync('*.js', { cwd: basePath });

const SequelizeConnect = require('../models/_config').sequelize;

const { gt, lte, ne, in: opIn } = Sequelize.Op;
/** */

const db = {};

module.exports = {
  async create(model, body) {
    const created_data = await model.create(body);
    return {
      ...this.jsonize(created_data),
      _id: await this.get_record_metadata(
        model,
        created_data.id,
        created_data.createdAt
      ),
    };
  },

  async read(
    model,
    seek_conditions,
    fields_to_return,
    sort_options,
    offset,
    limit
  ) {
    try {
      const result = await model.findAll({
        ...seek_conditions,
        ...fields_to_return,
        ...sort_options,
        offset,
        limit,
      });
      return this.jsonize([...result]);
    } catch (e) {
      console.log(`[AdminController] read_records: ${e.message}`);
    }
  },

  async count(model, fields_to_return, sort_options, offset, limit) {
    try {
      const count = (
        await model.findAndCountAll({
          ...fields_to_return,
          ...sort_options,
        })
      ).count;
      return this.jsonize({ count });
    } catch (e) {
      console.log(`[AdminController] count_records: ${e.message}`);
    }
  },

  jsonize(data) {
    return JSON.parse(JSON.stringify(data));
  },

  get_record_metadata: async (model, id, createdAt) => {
    const count = (
      await model.findAndCountAll({
        where: {
          createdAt: {
            [lte]: createdAt,
          },
        },
      })
    ).count;
    const n = count == 1 ? 1 : count;
    const foundModel = await model.findByPk(id);
    await foundModel.update({ _id: n });
    return n;
  },

  read_models() {
    files.forEach((file) => {
      if (file.toLocaleLowerCase().includes('_config')) return;
      const model = SequelizeConnect['import'](resolve(basePath, file));
      db[model.name] = model;
    });

    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
    db.sequelize = SequelizeConnect;
    db.Sequelize = Sequelize;
    return db;
  },
};
