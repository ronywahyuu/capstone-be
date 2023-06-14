import Joi from "joi";

// pattern for cannot contain only whitespace

const SchemaPostDonasiValidator = Joi.object({
  title: 
    Joi.string()
    .required()
    .min(3)
    .pattern(/^\S.*\S$/)
    .message("Title cannot contain only whitespace"),
  slug: Joi.string(),
  imgFile: Joi.string()
    // only accept image file
    .pattern(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)
    .message("Image must be an image file"),
  description: 
    Joi.string()
    .required()
    // min words is 3
    .pattern(/(\w+\s){2,}/)
    .message("Description must be at least 3 words"),
  linkForm: 
    Joi.string()
    .required()
    // must link 
    .pattern(/^(http|https):\/\/[^ "]+$/)
    .message("Link must be a valid URL")
})

export default SchemaPostDonasiValidator;