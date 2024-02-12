import { AuthMiddleware } from "../../lib/middleware/auth";
import {
 
  CreateProject,
  UpdateProject,
  getAllProject,
} from "./Controller";
import { Router } from "express";

const router = Router();
router.post(
  "/project/create",
  AuthMiddleware.Authenticate(["EMPLOYEE"]),
  CreateProject
);
router.patch(
  "/project/update/:id",
  AuthMiddleware.Authenticate(["EMPLOYEE"]),
  UpdateProject
);
router.get(
  "/project/all",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  getAllProject
);


export default router;
