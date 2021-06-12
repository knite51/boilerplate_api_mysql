/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/

const { build_query } = require('../utilities/query');

class RootService {
  constructor() {
    this.standard_metadata = {
      is_deleted: false,
    };

    this.exempted_data = {
      createdAt: false,
      updatedAt: true,
    };
  }

  /** Process DB Data */

  async handle_database_read(Controller, query_options, extra_options = {}) {
    const {
      count,
      fields_to_return,
      limit,
      seek_conditions,
      offset,
      sort_condition,
    } = build_query(query_options);
    if (count == 'true') {
      return {
        count: (
          await Controller.count_records({
            ...seek_conditions,
            ...extra_options,
          })
        ).count,
      };
    } else {
      return await Controller.read_records(
        { ...seek_conditions, ...extra_options },
        fields_to_return,
        sort_condition,
        offset,
        limit
      );
    }
  }

  process_single_read(result) {
    if (result && result.id) {
      return this.process_successful_response(result);
    }
    return this.process_failed_response(`Resource not found`, 404);
  }

  process_multiple_read_results(result) {
    if (result && (result.count >= 0 || result.length >= 0))
      return this.process_successful_response(result);
    return this.process_failed_response(`Resources not found`, 404);
  }

  process_update_result(result) {
    if (result) {
      return this.process_successful_response(result);
    }
    return this.process_failed_response(`Update failed`, 200);
  }

  process_delete_result(result) {
    if (result) {
      return this.process_successful_response(result);
    }
    return this.process_failed_response(`Deletion failed.`, 200);
  }

  /** Responses */

  process_failed_response(message, code = 400) {
    return {
      error: message,
      payload: null,
      status_code: code,
      success: false,
    };
  }

  process_successful_response(payload, code = 200) {
    return {
      payload,
      error: null,
      status_code: code,
      success: true,
    };
  }

  /** Validations */
  validate_email(raw_email) {
    const email = raw_email.trim();
    if (email.length < 6) {
      return {
        is_valid: false,
        message: `Email address is too short.`,
      };
    }

    const email_pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const is_valid = email_pattern.test(email);

    return {
      is_valid,
      message: is_valid ? email : `Invalid email address.`,
    };
  }
}

module.exports = RootService;
