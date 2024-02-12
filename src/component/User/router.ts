import { Router } from "express";
import {
  RegisterUser,
  forgotPassword,
  resetPassword,
  Login,
  resendResetPasswordOtp,
  OneEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  RegisterHR,
  updateImage,
  changePassword,
  getProfileImageRoute,
  deleteProfileImageRoute,
} from "./userController";

import { AuthMiddleware } from "../../lib/middleware/auth";
import upload from "../../lib/helper/multer";

const router = Router();

router.post("/register/hr", RegisterHR);
router.post("/register/user", RegisterUser);
router.post("/login", Login);
router.post("/resendResetPasswordOtp", resendResetPasswordOtp);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/login", Login);

// Get one employees
router.get(
  "/employees/:id",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  OneEmployee
);

// Get all employees
router.get(
  "/employees",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  getEmployee
);

// Update employee
router.put(
  "/employees/:id",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  updateEmployee
);

// Delete employee
router.delete(
  "/employees/:id",
  AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]),
  deleteEmployee
);

//settings and updates  
router.put("/updateProfile/:id", updateEmployee);
router.patch("/changePassword/:id", changePassword);
router.post("/upload_updateProfileImage/:id", upload.single('image'), updateImage);
router.get("/getProfileImage/:id", getProfileImageRoute);
router.delete("/deleteProfileImage/:id", deleteProfileImageRoute);


export default router;
