import bcryptjs, { genSalt } from "bcryptjs";
import Joi from "joi";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = async (input: Record<string, string>) => {
  console.log(process.env.JWT_SECRET);
  return Jwt.sign(input, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const verify = async (token: string) => {
  try {
    const verify = Jwt.verify(token, process.env.JWT_SECRET as string);
    return verify;
  } catch (error) {
    return "token expired";
  }
};

export const bcryptEncoded = async (value: { value: string }) => {
  return bcryptjs.hash(value.value, await genSalt());
};

export const bcryptDecode = (password: string, comparePassword: string) => {
  return bcryptjs.compare(password, comparePassword);
};

export const generatePasswordResetToken = (): number => {
  return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
};

export const hashPassword = (password: string): Promise<string> => {
  return bcryptjs.hash(password, bcryptjs.genSaltSync());
};

export const comparePasswords = (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcryptjs.compare(password, hashedPassword);
};

export const registerUserSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9]{3,18}$/)
    .required(),
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
  phone: Joi.string().required(),
});

export const registerEmployeeSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string(),
  role: Joi.string(),
  workSchedule: Joi.string().required(),
  endTime: Joi.string().required(),
  startTime: Joi.string().required(),
  DateOfBirth: Joi.date(),
  preferredName: Joi.string(),
  WorkLocation: Joi.string(),
  salary: Joi.string(),
  bankName: Joi.string().required(),
  accountNumber: Joi.string().required(),
  accountName: Joi.string().required(),
  JobTitle: Joi.string(),
  nameOfEmergencyContact:Joi.string(),
  relationshipWithEmergencyContact:Joi.string(),
  phoneNumberOfEmergencyContact:Joi.string(),
  isTeamLead: Joi.boolean(),
  DateOfEmployment: Joi.date(),
  employee_Department: Joi.string().required(),
  employee_Status: Joi.string(),
  emergency_contact: Joi.string(),
  image: Joi.string(),
});

// export const updateEmployeeSchema = Joi.object().keys({
//   email: Joi.string().trim().lowercase().email(),
//   firstName: Joi.string(),
//   lastName: Joi.string(),
//   preferredName: Joi.string(),
//   DateOfBirth: Joi.date(),
//   address: Joi.string(),
//   City_State:  Joi.string(),
//   Zip_code: Joi.number(),
// });

export const option = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

export const verifyCode = Joi.object().keys({
  email: Joi.string().trim().lowercase().email().required(),
  code: Joi.string().required(),
});

export const resetPasswordSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().email().required(),
  code: Joi.number().required(),
  password: Joi.string().required(),
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});
export const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
});

export const loginUserSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9]{3,18}$/)
    .required(),
});

export const resendVerificationOtpSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
});

export const resendResetPasswordOtpSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
});

export const updateEmployeeSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  JobTitle: Joi.string().required(),
  isTeamLead: Joi.boolean().optional(),
  EmploymentStatus: Joi.string().required(),
  employee_Department: Joi.string().required(),
});

export const updateProfilePictureSchema = Joi.object().keys({
  image: Joi.binary().encoding("base64").required(),
});

// export const updateEmployeePasswordSchema = Joi.object().keys({
//   password: Joi.string().required(),
//   confirm_password: Joi.any()
//     .equal(Joi.ref("password"))
//     .required()
//     .label("Confirm password")
//     .messages({ "any.only": "{{#label}} does not match" }),
// });

export const updateEmployeePasswordSchema = Joi.object().keys({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref("newPassword"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

export const createLeaveRequest = Joi.object().keys({
  employeeId: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  department: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  reason: Joi.string().required(),
  supervisorName: Joi.string().required(),
  employmentStatus: Joi.string().required(),
  comment: Joi.string(),
  totalLeaveDaysRequested: Joi.number().integer().min(0).required(),
  attachment: Joi.string().optional(),
});

export const updateleaveRequest = Joi.object().keys({
  status: Joi.string().required(),
});
export const createPayriseRequest = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  department: Joi.string().required(),
  DateOfHire: Joi.date().required(),
  reasons: Joi.string().required(),
  EmployeeStatus: Joi.string().required(),
  jobTitle: Joi.string().required(),
  currentPay: Joi.number().required(),
  proposedPay: Joi.number().required(),
  attachments: Joi.string().optional(),
  employeeId: Joi.string().required(),
});

export const updatePayriseRequest = Joi.object().keys({
  status: Joi.string().required(),
});

export const ProjectSchema = Joi.object().keys({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  projectTitle: Joi.string().required(),
  description: Joi.string().required(),
  projectStatus: Joi.string().required(),
  OwnerId: Joi.string().required(),
  members: Joi.array().items(Joi.string()),
  Task: Joi.array().items(Joi.string()),
});
export const UpdateProjectSchema = Joi.object().keys({
  projectStatus: Joi.string().required(),
});
export const AssignMemberSchema = Joi.object().keys({
  members: Joi.array().items(Joi.string()).required(),
});

export const CreateTaskSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  assignedTo: Joi.string().optional(),
  timeline: Joi.date().required(),
  projectId: Joi.string().required(),
});

export const updateTaskRequest = Joi.object().keys({
  status: Joi.string().required(),
});
export const assignTaskSchema = Joi.object().keys({
  assignedTo: Joi.string().required(),
});
