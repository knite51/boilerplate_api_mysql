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

const { gt, lte, ne, in: opIn, or: opOr } = Sequelize.Op;
/** */

const db = {};

module.exports = {
  async create(model, body) {
    try {
      const created_data = await model.create(body);

      const _id = await this.get_record_metadata(
        model,
        created_data.id,
        created_data.createdAt
      );

      const result = { ...this.jsonize(created_data), _id };

      return this.delete_record_metadata(result);
    } catch (e) {
      console.log(`[AdminController] read_records: ${e.message}`);
    }
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
      return this.jsonize(this.delete_record_metadata(result));
    } catch (e) {
      console.log(`[AdminController] read_records: ${e.message}`);
    }
  },

  async update(model, seek_conditions, data_to_set, update_type) {
    try {
      let result;

      if (update_type === 'Single') {
        const foundModelItem = await model.findByPk(seek_conditions);
        result = await foundModelItem.update(data_to_set);
      } else {
        result = await model.update(data_to_set, seek_conditions);
      }

      return update_type === 'Single'
        ? this.jsonize(this.delete_record_metadata(result))
        : this.jsonize(result);
    } catch (e) {
      console.log(`[AdminController] update_records: ${e.message}`);
    }
  },

  async purge(model, seek_conditions) {
    try {
      const result = await model.destroy(seek_conditions);
      return this.jsonize(result);
    } catch (e) {
      console.log(`[AdminController] purge_records: ${e.message}`);
    }
  },

  async count(
    model,
    seek_conditions,
    fields_to_return,
    sort_options,
    offset,
    limit
  ) {
    try {
      const count = (
        await model.findAndCountAll({
          ...seek_conditions,
          ...fields_to_return,
          ...sort_options,
          offset,
          limit,
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

  delete_record_metadata(records) {
    if (records.dataValues || Array.isArray(records)) {
      if (Array.isArray(records)) {
        records.forEach((record) => {
          delete record.dataValues.createdAt;
          delete record.dataValues.updatedAt;
          delete record.dataValues.is_deleted;
        });
      } else {
        delete records.dataValues.createdAt;
        delete records.dataValues.updatedAt;
        delete records.dataValues.is_deleted;
      }
    } else {
      delete records.createdAt;
      delete records.updatedAt;
      delete records.is_deleted;
    }
    return records;
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
