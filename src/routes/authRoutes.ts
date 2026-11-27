import { Router } from "express";
import { login, register } from "../controllers/authController";

const router = Router();

router.post(
  "/register",
  /* #swagger.tags = ['Authentication'] */
  register,
);

router.post(
  "/login",
  /* #swagger.tags = ['Authentication'] */
  login,
);

export default router;
