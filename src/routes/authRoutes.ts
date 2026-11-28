import { Router } from "express";
import { login, register } from "../controllers/authController";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter";
import { loginSchema, registerSchema } from "../validators/authValidator";
import validate from "../middleware/validate";

const router = Router();

router.post(
  "/register",
  registerLimiter,
  validate(registerSchema),
  /* #swagger.tags = ['Authentication'] */
  register,
);

router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  /* #swagger.tags = ['Authentication'] */
  login,
);

export default router;
