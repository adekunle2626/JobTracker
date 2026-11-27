import { HydratedDocument } from "mongoose";
import User, { IUser } from "../models/User";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<IUser>; // a full user document, so later steps can change and .save() it
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const secret = process.env["JWT_SECRET"];

    if (!secret) {
      return res.status(500).json({ message: "JWT SECRET not provided." });
    }

    const payload = jwt.verify(token, secret) as { userId: string };
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
