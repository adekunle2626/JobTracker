import { Request, Response, NextFunction } from "express";

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user!;

  if (user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "You are not allowed to perform this action." });
  }
  next();
};
