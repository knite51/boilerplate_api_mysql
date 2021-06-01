/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/

const RootService = require('./_root');
const AdminController = require('../controllers/admin');
const AdminValidator = require('../validators/admin');

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

  async read_records_by_filter(request, next) {
    try {
      const { query } = request;
      const result = await this.handle_database_read(
        this.admin_controller,
        query
        // { ...this.standard_metadata, ...this.exempted_data }
      );
      return this.process_multiple_read_results(result);
    } catch (e) {
      const err = this.process_failed_response(
        `[AdminService] read_records_by_filter: ${e.message}`,
        500
      );
      next(err);
    }
  }
}

module.exports = new AdminService(AdminController, AdminValidator);
