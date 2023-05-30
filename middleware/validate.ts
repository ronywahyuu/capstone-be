import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validate = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json(error);
    }
    next();
  };
};

export default validate;
