const Joi = require("joi");

const customerSchema = Joi.object({
  name: Joi.string().min(1).required(),
  cust_id: Joi.number().required(),
  email: Joi.string().required(),
});

module.exports = customerSchema;
