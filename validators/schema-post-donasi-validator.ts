import Joi from "joi";

// pattern for cannot contain only whitespace

const SchemaPostDonasiValidator = Joi.object({
  title: 
    Joi.string()
    .required()
    .min(3)
    .pattern(/^\S.*\S$/)
    .pattern(/^[^0-9]*$/),
  slug: Joi.string(),
  description: 
    Joi.string()
    .required()
    // min words is 5
    .pattern(/(\w+\s){4,}/),
  linkForm: 
    Joi.string()
    .required()
    // must link 
    .pattern(/^(http|https):\/\/[^ "]+$/),
})

export default SchemaPostDonasiValidator;