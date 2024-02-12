import { Request, Response } from "express";
import {
  bcryptEncoded,
  comparePasswords,
  forgotPasswordSchema,
  generatePasswordResetToken,
  loginUserSchema,
  option,
  registerEmployeeSchema,
  registerUserSchema,
  resendResetPasswordOtpSchema,
  resendVerificationOtpSchema,
  resetPasswordSchema,
  updateEmployeeSchema,
  updateEmployeePasswordSchema,
  verifyCode,
} from "../../utils/utils";
import { Department, ROLE, User, UserModel } from "./model";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  sendOTPVerificationEmail,
  sendResetOTP,
} from "../../lib/helper/sendVerificationEmail";
import { sendEmployeeEmail } from "../../lib/helper/sendEmployeeEmail";
import { EmployeePassword } from "../../lib/helper/generateEmployeePassword";
import generateVerifcationOTP from "../../lib/helper/generateVerficationOTP";
import { generateEmployeeId } from "../../lib/helper/generateEmployeeId";
import { hashPassword } from "../../utils/utils";
import cloudinary from "../../lib/helper/cloudinary";

// ============================ REGISTRATION SECTION ===================== //
// ============================ ==================== ===================== //
export const RegisterHR = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, phone, password, confirm_password } =
      req.body;

    const validateResult = registerUserSchema.validate(req.body, option);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }
    const exist = await UserModel.findOne({ where: { email } });
    if (exist) {
      return res.status(400).json({ error: "email already in use" });
    }

    const id = uuidv4();
    const user = await UserModel.create({
      ...validateResult.value,
      id,
      role: ROLE.HR,
      password: await hashPassword(password),
    });
    return res.status(201).json({ msg: "HR created successfully", user });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};
export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phone,
      role,

      employee_Status,
      employee_Department,
      preferredName,
      WorkLocation,
      salary,
      bankName,
      accountName,
      accountNumber,
      emergency_contact,
      JobTitle,
      isTeamLead,
    } = req.body;

    const validateResult = registerEmployeeSchema.validate(req.body, option);
    // console.log(validateResult)

    if (validateResult.error) {
      return res
        .status(400)
        .json({ error: validateResult.error.details[0].message });
    }
    const userPass = EmployeePassword();
    //Generate salt for password hash
    const salt = await bcrypt.genSalt(10);
    //Generate password hash (salt + hash)
    const passwordHash = await bcrypt.hash(userPass, salt);

    //Check if user exist
    const user = await UserModel.findOne({
      where: { email: email },
    });
    if (user) {
      return res.status(400).json({ error: "Email already exist" });
    }

    const id = uuidv4();
    const random = Math.floor(Math.random() * 1000000);
    const alphabet = req.body.employee_Department.slice(0, 2);
    const employeeId = alphabet + random;

    const newUser = await UserModel.create({
      ...validateResult.value,
      id,
      employeeId,
      role: ROLE.EMPLOYEE,
      password: await hashPassword(userPass),
    });

    if (!newUser) {
      return res.status(400).json({ error: "Email already exist" });
    }
    sendEmployeeEmail(email, userPass,employeeId);

    return res.status(201).json({
      msg: "Your Employee Login has been sent to your email",
      newUser,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

// ============================ LOGIN SECTION ===================== //
// ============================ ==================== ===================== //

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const validateResult = loginUserSchema.validate(req.body, option);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ error: validateResult.error.details[0].message });
    }

    const User = (await UserModel.findOne({
      where: { email: email },
    })) as unknown as { [key: string]: string };
    console.log(User)

    if (!User) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }
    console.log(User);
    const { id } = User;

    const validUser = await bcrypt.compare(password, User.password);

    if (!validUser) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: User.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.cookie("token", "token", {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "SUCCESS",
      User,
      token,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// ============================ EMPLOYEE SECTION ===================== //
// ============================ ==================== ===================== //

export const OneEmployee = async (req: Request, res: Response) => {
  try {
    const OneEmployee = await UserModel.findOne({
      where: { id: req.params.id },
    });
    return res.status(200).json({ OneEmployee });
  } catch (error) {
    return res.status(500).json({ error, message: "error fetching employee" });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const employees = await UserModel.findAll({
      where: { role: ROLE.EMPLOYEE },
    });

    return res
      .status(200)
      .json({ employees, message: "All employees has been fetched" });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ error, message: "error fetching employees" });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    // const UpdateemployeeId = req.params.id;
    // console.log(UpdateemployeeId);
    // const employee = await UserModel.findOne({
    //   where: { id: UpdateemployeeId },
    // });
    const { id } = req.params;
    const { error, value } = updateEmployeePasswordSchema.validate(
      req.body,
      option
    );
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const employee = await UserModel.findByPk(id);

    if (!employee) {
      throw new Error("Employee not found");
    }

    // Update the employee data
    await employee.update(req.body);

    // Fetch the updated employee data
    // const updatedEmployee = await UserModel.findByPk(employeeId);
    return res.status(201).json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee:", error);
    throw new Error("Error updating employee");
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const DeleteemployeeId = req.params.id;
    console.log(DeleteemployeeId);
    const employee = await UserModel.findOne({
      where: { id: DeleteemployeeId },
    });
    console.log(employee);

    if (!employee) {
      throw new Error("Employee not found");
    }

    // Delete the employee
    await employee.destroy();

    return res.status(201).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw new Error("Error deleting employee");
  }
};

export const getEmployees = async () => {
  try {
    const employees = await UserModel.findAll();
    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error("Error fetching employees");
  }
};

// ============================ CHANGE PASSWORD SECTION ===================== //
// ============================ ==================== ===================== //

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = updateEmployeePasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await UserModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log the retrieved user object to inspect it
    console.log("Retrieved User Object:", user.toJSON());

    // Access the password property on the user instance
    const userPassword = user.get("password");

    // Log passwords for debugging
    console.log("Provided Password:", value.currentPassword);
    console.log("Stored Hashed Password:", userPassword);

    // Verify the current password with the known correct password
    // Verify the current password
    const isPasswordValid = await bcrypt.compare(
      value.currentPassword.trim(),
      userPassword as string
    );

    console.log("Is Password Valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Continue with the password update logic

    const hashedPassword = await bcrypt.hash(value.newPassword, 10);
    console.log("Hashed Password:", hashedPassword);

    await user.update({ password: hashedPassword });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ============================ IMAGE UPLOAD/UPDATE SECTION ===================== //
// ============================ ==================== ===================== //

// Upload/Update Profile Image Route
export const updateImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Get the Cloudinary URL
    const imageUrl = result.secure_url;

    // Assuming you have a user ID in the request parameters
    const { id } = req.params;

    // Update the user's profile image URL in the database
    const user = await UserModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's profile with the new image URL
    await user.update({ image: imageUrl });

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Update profile image error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProfileImageRoute = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await UserModel.findByPk(userId);

    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    // Log the user object to inspect
    console.log("User Object:", user.toJSON());

    // Get the profile image URL from the user data
    const profileImageUrl = user.get("image"); // Adjust property name based on your model

    if (!profileImageUrl) {
      console.log("Profile image not found for user ID:", userId);
      return res
        .status(404)
        .json({ error: "Profile image not found for the user" });
    }

    // Respond with the profile image URL
    res.status(200).json({ profileImageUrl });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProfileImageRoute = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await UserModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the profile image URL from the user data
    const profileImageUrl = (user as any).image;

    if (!profileImageUrl) {
      return res
        .status(404)
        .json({ error: "Profile image not found for the user" });
    }

    // Delete the image from Cloudinary
    const publicId = profileImageUrl.split("/").pop()?.split(".")[0];
    await cloudinary.uploader.destroy(publicId as string);

    // Update the user model to remove the image property
    const defaultImageUrl = "default_image_url"; // Replace with an appropriate default value
    await user.update({ image: defaultImageUrl });

    res.status(200).json({ message: "Profile image deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ============================ VERIFY OTP SECTION ===================== //
// ============================ ==================== ===================== //

// export const verifyOTP = async (req: Request, res: Response) => {
//   try {
//     const { code, email } = req.body;
//     const validateResult = verifyCode.validate(req.body, option);

//     if (validateResult.error) {
//       return res
//         .status(400)
//         .json({ error: validateResult.error.details[0].message });
//     }

//     const user = (await UserModel.findOne({
//       where: { email: email },
//     })) as unknown as User;

//     console.log(user, code, user.verificationOTP);

//     if (!user) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     if (user.verificationOTP !== (code as string)) {
//       return res.status(400).json({
//         error: "Invalid token",
//       });
//     }

//     if ((user.expiresAt as number) < new Date().getTime()) {
//       return res.status(400).json({
//         error: "Invalid token",
//       });
//     }

//     user.verificationOTP = "";
//     user.isVerified = true;

//     await UserModel.update(
//       {
//         expiresAt: user.expiresAt,
//         verificationOTP: user.verificationOTP,
//         isVerified: true,
//       },
//       { where: { id: user.id } }
//     );

//     return res.status(200).json({ message: "SUCCESS" });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// };

// ============================ FORGOT PASSWORD SECTION ===================== //
// ============================ ==================== ===================== //

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const validationResult = forgotPasswordSchema.validate(req.body, option);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ error: validationResult.error.details[0].message });
    }
    const email = req.body;

    const user = await UserModel.findOne({ where: email });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const OTP = generateVerifcationOTP();

    const recipient = user.dataValues.email;
    sendResetOTP(recipient, OTP);

    const userReset = await UserModel.update(
      {
        resetPasswordCode: OTP,
        resetPasswordStatus: true,
        resetPasswordExpiration: Date.now() + 600000,
      },
      { where: email }
    );

    return res.status(200).json({ message: "SUCCESS" });
  } catch (error) {
    res.status(500).json(error);
  }
};

// ============================ RESET PASSWORD SECTION ===================== //
// ============================ ==================== ===================== //

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, password, confirm_password } = req.body;
    const validation = resetPasswordSchema.validate(req.body, option);
    if (validation.error) {
      return res
        .status(400)
        .json({ error: validation.error.details[0].message });
    }
    const user = (await UserModel.findOne({
      where: { email },
    })) as unknown as User;
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    if (user.resetPasswordCode !== code) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    if (
      user.resetPasswordExpiration &&
      (user.resetPasswordExpiration as number) < new Date().getTime()
    ) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const hash = await bcryptEncoded({ value: password });

    const userEmail = await UserModel.update(
      {
        password: hash,
        resetPasswordStatus: false,
        resetPasswordCode: null,
        resetPasswordExpiration: null,
      },
      { where: { id: user.id } }
    );
    if (!userEmail) {
      let info: { [key: string]: string } = {
        error: "Invalid credentials",
      };
      throw new Error(info.error);
    }

    return res.status(200).json({ message: "SUCCESS" });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// ============================ RESEND VERIFICATION OTP SECTION ===================== //
// ============================ ==================== ===================== //

// export const resendVerificationOtp = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;

//     const validation = resendVerificationOtpSchema.validate(req.body, option);
//     if (validation.error) {
//       return res
//         .status(400)
//         .json({ error: validation.error.details[0].message });
//     }

//     const user = await UserModel.findOne({
//       where: { email: email },
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const OTP = generateVerifcationOTP();
//     sendOTPVerificationEmail(email, OTP);

//     await UserModel.update(
//       {
//         verificationOTP: OTP,
//         expiresAt: Date.now() + 5 * 60 * 1000,
//       },
//       { where: { email: email } }
//     );

//     return res.status(200).json({ message: "SUCCESS" });
//   } catch (error) {
//     return res.status(500).json({
//       error,
//     });
//   }
// };

// ============================ RESEND RESET PASSWORD OTP SECTION ===================== //
// ============================ ==================== ===================== //

export const resendResetPasswordOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const validation = resendResetPasswordOtpSchema.validate(req.body, option);
    if (validation.error) {
      return res
        .status(400)
        .json({ error: validation.error.details[0].message });
    }

    const user = (await UserModel.findOne({
      where: { email: email },
    })) as unknown as User;

    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const OTP = generateVerifcationOTP();
    sendResetOTP(email, OTP);

    await UserModel.update(
      {
        resetPasswordCode: OTP,
        resetPasswordStatus: true,
        resetPasswordExpiration: Date.now() + 5 * 60 * 1000,
      },
      { where: { email: email } }
    );

    return res.status(200).json({ message: "SUCCESS" });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

// export const resendVerificationOtp = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ error: "email is required" });
//     }
//     const user = await UserModel.findOne({ where: { email } });

//     if (!user) {
//       return res.status(400).json({ error: "user does not exits" });
//     }
//     const OTP = generateVerifcationOTP();
//     sendOTPVerificationEmail(email, OTP);
//     const userUpdate = await UserModel.update(
//       {
//         verificationOTP: OTP,
//         expiresAt: Date.now() + 5 * 60 * 1000,
//         isVerified: false,
//       },
//       { where: { email } }
//     );

//     return res
//       .status(200)
//       .json({ message: "new OTP has been sent to your mail" });
//   } catch (error) {
//     return res.status(500).json({ error });
//   }
// };
