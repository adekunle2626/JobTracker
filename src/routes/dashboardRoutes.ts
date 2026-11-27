import { Router } from "express";
import { dashboardStatistics } from "../controllers/dashboardController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get(
  "/dashboard",
  /* #swagger.tags = ['Dashboard'] */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  dashboardStatistics,
);

export default router;
