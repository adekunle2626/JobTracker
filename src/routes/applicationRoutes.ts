import { Router } from "express";
import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController";
import { adminUpdateApplication } from "../controllers/adminUpdateApplication";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";

const router = Router();

router.use(requireAuth);

router.post(
  "/applications",
  /* #swagger.tags = ['Applications'] */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  createApplication,
);

router.get(
  "/applications",
  /* #swagger.tags = ['Applications'] */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  getApplications,
);

router.get(
  "/applications/:id",
  /* #swagger.tags = ['Applications'] */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  getApplication,
);

router.patch(
  "/applications/:id",
  /* #swagger.tags = ['Applications'] */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /*
    #swagger.parameters['body'] = {
      in: 'body',
      schema: { $ref: '#/definitions/UserApplicationUpdate' }
    }
  */
  updateApplication,
);

router.patch(
  "/admin/applications/:id",
  /* #swagger.tags = ['Applications'] */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /*
    #swagger.parameters['body'] = {
      in: 'body',
      schema: { $ref: '#/definitions/AdminApplicationUpdate' }
    }
  */
  requireAdmin,
  adminUpdateApplication,
);

router.delete(
  "/applications/:id",
  /* #swagger.tags = ['Applications'] */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  deleteApplication,
);

export default router;
