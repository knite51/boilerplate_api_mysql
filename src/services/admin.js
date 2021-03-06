/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/

const RootService = require('./_root');
const AdminController = require('../controllers/admin');
const AdminValidator = require('../validators/admin');

const {
  build_query,
  build_wildcard_options,
  build_many_action_query,
  build_purge_query,
} = require('../utilities/query');

class AdminService extends RootService {
  constructor(admin_controller, admin_validator) {
    super();
    this.admin_controller = admin_controller;
    this.admin_validator = admin_validator;
  }

  async create_record(request, next) {
    try {
      const { body } = request;

      const { error } = this.admin_validator
        .requiredProperties()
        .validate(body);
      if (error) throw new Error(error);

      const result = await this.admin_controller.create_record(body);
      return this.process_single_read(result);
    } catch (e) {
      const err = this.process_failed_response(
        `[AdminService] created_record: ${e.message}`,
        500
      );
      next(err);
    }
  }

  async read_record_by_id(request, next) {
    try {
      const { id } = request.params;
      if (!id)
        return next(this.process_failed_response(`Invalid ID supplied.`));
      const result = await this.admin_controller.read_records({
        where: { id, ...this.standard_metadata },
      });
      return this.process_single_read(result[0]);
    } catch (e) {
      const err = this.process_failed_response(
        `[AdminService] read_record_by_id: ${e.message}`,
        500
      );
      return next(err);
    }
  }

  async read_records_by_filter(request, next) {
    try {
      const { query } = request;
      const result = await this.handle_database_read(this.admin_controller, {
        ...query,
        ...this.standard_metadata,
      });
      return this.process_multiple_read_results(result);
    } catch (e) {
      const err = this.process_failed_response(
        `[AdminService] read_records_by_filter: ${e.message}`,
        500
      );
      next(err);
    }
  }

  async read_records_by_wildcard(request, next) {
    try {
      const { params, query } = request;
      if (!params.keys || !params.keys) {
        return next(this.process_failed_response(`Invalid key/keyword`, 400));
      }

      const wildcard_conditions = build_wildcard_options(
        params.keys,
        params.keyword,
        this.standard_metadata
      );

      let result = await this.handle_database_read(
        this.admin_controller,
        query,
        wildcard_conditions
      );
      return this.process_multiple_read_results(result);
    } catch (e) {
      const err = this.process_failed_response(
        `[AdminService] read_records_by_wildcard: ${e.message}`,
        500
      );
      next(err);
    }
  }

  async read_deleted_data(request, next) {
    try {
      const { query } = request;
      const result = await this.handle_database_read(this.admin_controller, {
        ...query,
        ...{
          is_deleted: true,
        },
      });
      return this.process_multiple_read_results(result);
    } catch (e) {
      const err = this.process_failed_response(
        `[AdminService] read_deleted_data: ${e.message}`,
        500
      );
      next(err);
    }
  }

  async update_record_by_id(request, next) {
    try {
      const { id } = request.params;
      const data = request.body;

      if ((await this.read_record_by_id(request)).success == false)
        return next(this.process_failed_response(`Invalid ID supplied.`));

      const result = await this.admin_controller.update_records(
        id,
        data,
        'Single'
      );
      return this.process_update_result({ ...result, id });
    } catch (e) {
      const err = this.process_failed_response(
        `[AdminService] update_record_by_id: ${e.message}`,
        500
      );
      next(err);
    }
  }

  async update_many_records(request, next) {
    try {
      const { options, data } = request.body;
      const { seek_conditions } = build_many_action_query(
        options,
        this.standard_metadata
      );

      const result = await this.admin_controller.update_records(
        seek_conditions,
        data,
        'Multiple'
      );
      return this.process_update_result({
        number_of_col_updated: result.toString(),
        ...data,
      });
    } catch (e) {
      const err = this.process_failed_response(
        `[AdminService] update_many_records: ${e.message}`,
        500
      );
      next(err);
    }
  }

  async delete_record_by_id(request, next) {
    try {
      const { id } = request.params;
      if ((await this.read_record_by_id(request)).success == false)
        return next(this.process_failed_response(`Invalid ID supplied.`));

      const result = await this.admin_controller.delete_records(id, 'Single');

      return this.process_delete_result(result ? 'Deleted' : null);
    } catch (e) {
      const err = this.process_failed_response(
        `[DepartmentService] delete_record_by_id: ${e.message}`,
        500
      );
      next(err);
    }
  }

  async delete_many_records(request, next) {
    try {
      const { options } = request.body;
      const { seek_conditions } = build_many_action_query(
        options,
        this.standard_metadata
      );

      const result = await this.admin_controller.delete_records({
        ...seek_conditions,
      });

      return this.process_delete_result({
        number_of_col_deleted: result.toString(),
      });
    } catch (e) {
      const err = this.process_failed_response(
        `[DepartmentService] delete_records: ${e.message}`,
        500
      );
      next(err);
    }
  }

  async purge_data(request, next) {
    try {
      const { options } = request.body;
      const { seek_conditions } = build_purge_query(options, {
        is_deleted: true,
      });

      const result = await this.admin_controller.purge_records({
        ...seek_conditions,
      });

      return this.process_delete_result({
        number_of_col_deleted: result.toString(),
      });
    } catch (e) {
      const err = this.process_failed_response(
        `[DepartmentService] purge_data: ${e.message}`,
        500
      );
      next(err);
    }
  }
}

module.exports = new AdminService(AdminController, AdminValidator);
