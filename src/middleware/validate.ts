import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        // message: "Validation failed",
        error: result.error.issues[0].message,
      });
    }

    req.body = result.data;
    next();
  };
};

export default validate;
