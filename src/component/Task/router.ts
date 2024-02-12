import express from "express";
import { AuthMiddleware } from "../../lib/middleware/auth";
import {
  AssignTask,
  createTask,
  getAllTaskProject,
  getTask,
  getTaskProject,
  updateTask,
} from "./controller";

const router = express.Router();

router.post(
  "/task/create",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  createTask
);
router.get(
  "/task/get",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  getTask
);
router.patch(
  "/task/update/:id",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  updateTask
);
router.get(
  "/task/:id",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  getTaskProject
);
router.get(
  "/task",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  getAllTaskProject
);
router.patch(
  "/task/:id",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  AssignTask
);
export default router;
