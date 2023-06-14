import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validate = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      if (error instanceof Joi.ValidationError) {
        return res.status(400).json({
          error: true,
          message: error.details[0].message,
        });
      }
      // return res.status(400).json(error);
    }

    // res.locals.error = errorValue
    next();
  };
};

export default validate;
