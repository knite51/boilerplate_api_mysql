/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 */
const Sequelize = require('sequelize');
const { gt, lte, ne, in: opIn, or: opOr, notIn, between, like } = Sequelize.Op;

exports.build_query = (options) => {
  let seek_conditions = {};

  const sort_condition = options.sort_by
    ? this.build_sort_order_string(options.sort_by, options.sort_format)
    : '';

  const fields_to_return = options.return_only
    ? this.build_return_fields_string(options.return_only)
    : '';

  const count = options.count || false;

  let offset = 0,
    limit = Number.MAX_SAFE_INTEGER;

  if (options.page && options.pageSize) {
    const pagination = this.determine_pagination(
      options.page,
      options.pageSize
    );
    limit = pagination.limit;
    offset = pagination.offset;
  }

  // /** Delete sort and return fields */
  delete options.count;
  delete options.page;
  delete options.pageSize;
  delete options.return_only;
  delete options.sort_by;

  Object.keys(options).forEach((field) => {
    const field_value = options[field];
    let condition;

    if (field_value.includes(':')) {
      condition = this.build_in_query(field, field_value);
    } else if (field_value.includes('!')) {
      condition = this.build_nor_query(field, field_value);
    } else if (field_value.includes('~')) {
      condition = this.build_range_query(field, field_value);
    } else {
      condition = this.build_or_query(options);
    }

    seek_conditions['where'] = { ...condition };
  });

  return {
    count,
    fields_to_return,
    limit,
    seek_conditions,
    offset,
    sort_condition,
  };
};

exports.build_return_fields_string = (value) => {
  const fields = value.split(',');
  return { attributes: fields };
};

exports.build_sort_order_string = (value, format = 'ASC') => {
  const values = value.split(',');
  let order = [];
  values.forEach((el) => {
    order.push([`${el}`, format]);
  });
  return { order: [...order] };
};

exports.determine_pagination = (page, pageSize) => {
  return {
    limit: Number(pageSize),
    offset: page == 1 ? 0 : Number(page - 1) * Number(pageSize),
  };
};

exports.build_in_query = (key, value) => {
  const values = value.split(':');
  return {
    [key]: {
      [opIn]: [...values],
    },
  };
};

exports.build_or_query = (options) => {
  let arrOption = [];
  for (const key in options) {
    arrOption.push({ [key]: options[key] });
  }
  return {
    [opOr]: [...arrOption],
  };
};

exports.build_nor_query = (key, value) => {
  const values = value.split('!');
  return {
    [key]: {
      [notIn]: [...values.slice(1)],
    },
  };
};

exports.build_range_query = (key, value) => {
  const values = value.split('-').slice(1);
  return {
    [key]: {
      [between]: [...values],
    },
  };
};

exports.build_wildcard_options = (key_list, value) => {
  const keys = key_list.split(',');
  return {
    where: {
      [opOr]: keys.map((key) => ({
        [key]: {
          [like]: `%${value}%`,
        },
      })),
    },
  };
};
