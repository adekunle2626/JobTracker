import { Router } from "express";
import { login, register } from "../controllers/authController";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter";
const router = Router();

router.post(
  "/register", registerLimiter,
  /* #swagger.tags = ['Authentication'] */
  register,
);

router.post(
  "/login",
  loginLimiter,
  /* #swagger.tags = ['Authentication'] */
  login,
);

export default router;
