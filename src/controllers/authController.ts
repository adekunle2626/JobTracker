import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const normalizedEmail = email.trim().toLowerCase();
  const existingEmail = await User.findOne({ email: normalizedEmail });

  if (existingEmail) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const token = jwt.sign({ userId: user._id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });

  return res.status(201).json({
    token,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();
  const aUser = await User.findOne({ email: normalizedEmail });

  if (!aUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const pass = await bcrypt.compare(password, aUser.password);
  if (!pass) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: aUser._id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });

  return res.status(200).json({
    token,
    user: { id: String(aUser._id), name: aUser.name, email: aUser.email },
  });
};
