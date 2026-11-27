import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  // 2. Mongoose cast errors
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: "Invalid value or data type",
    });
  }

  // 3. Duplicate key errors (e.g. email already exists)
  const error = err as {
    code?: number;
  };

  if (error.code === 11000) {
    return res.status(409).json({
      message: "A record with this value already exists",
    });
  }

  // 4. Unexpected errors
  console.error(err);

  return res.status(500).json({
    message: "An unexpected server error occurred",
  });
};

export default errorHandler;
