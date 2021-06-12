/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/
const SuperController = require('./_super');
const SuperService = require('../services/_root');

module.exports = {
  create_record: async (data) => {
    try {
      const created_record = await SuperController.create(
        SuperController.read_models().Admins,
        data
      );
      return { ...created_record };
    } catch (e) {
      console.log(`[AdminController] create_record: ${e.message}`);
      throw new Error(e.message);
    }
  },

  async read_records(
    conditions,
    fields_to_return = '',
    sort_options = '',
    offset = 0,
    limit = Number.MAX_SAFE_INTEGER
  ) {
    try {
      const read_record = await SuperController.read(
        SuperController.read_models().Admins,
        conditions,
        fields_to_return,
        sort_options,
        offset,
        limit
      );
      return read_record;
    } catch (e) {
      console.log(`[AdminController] read_records: ${e.message}`);
    }
  },

  async update_records(conditions, data_to_set, update_type) {
    try {
      const update_record = await SuperController.update(
        SuperController.read_models().Admins,
        conditions,
        data_to_set,
        update_type
      );
      return update_record;
    } catch (e) {
      console.log(`[AdminController] update_records Error: ${e.message}`);
    }
  },

  async delete_records(conditions, update_type) {
    try {
      const update_record = await SuperController.update(
        SuperController.read_models().Admins,
        conditions,
        { is_deleted: true },
        update_type
      );
      return update_record;
    } catch (e) {
      console.log(`[AdminController] delete_records Error: ${e.message}`);
    }
  },

  async purge_records(conditions) {
    try {
      const purged_records = await SuperController.purge(
        SuperController.read_models().Admins,
        conditions
      );
      return purged_records;
    } catch (e) {
      console.log(`[AdminController] purge_records Error: ${e.message}`);
    }
  },

  async count_records(
    conditions,
    fields_to_return = '',
    sort_options = '',
    offset = 0,
    limit = Number.MAX_SAFE_INTEGER
  ) {
    try {
      const read_record = await SuperController.count(
        SuperController.read_models().Admins,
        conditions,
        fields_to_return,
        sort_options,
        offset,
        limit
      );
      return read_record;
    } catch (e) {
      console.log(`[AdminController] count_records: ${e.message}`);
    }
  },
};
