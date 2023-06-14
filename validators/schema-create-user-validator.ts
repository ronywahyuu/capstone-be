import Joi from "joi";

const SchemaCreateUserValidator = Joi.object({
  name: Joi.string()
    .required()
    .min(3)
    .pattern(/^\S.*\S$/)
    .pattern(/^[^0-9]*$/),
  email: Joi.string()
    .required()
    .email(),
  password: Joi.string()
    .required()
    .min(8),
  profession: Joi.string()
    .optional()
});

export default SchemaCreateUserValidator;
