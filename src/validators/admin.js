/**
 * @author Ayotunde Olubiyo O. <knite51@gmail.com>
 **/

const Joi = require('@hapi/joi');

module.exports = {
  requiredProperties: () => {
    return Joi.object({
      _id: Joi.number().min(1).max(Number.MAX_SAFE_INTEGER),
      username: Joi.string().required(),
      password: Joi.number().required(),
    });
  },
};
