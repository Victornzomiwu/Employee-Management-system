import express from "express";
import {
  createLeave,
  getLeave,
  imageUpload,
  updateLeave,
} from "./leaveController";
import { AuthMiddleware } from "../../lib/middleware/auth";
import upload from "../../lib/helper/multer";

const router = express.Router();

router.post(
  "/create",
  //AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  createLeave
);
router.get(
  "/get/leave",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  getLeave
);
router.patch(
  "/update/leave/:id",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  updateLeave
);

router.post("/image", upload.single("image"), imageUpload);

export default router;
