import sequelize from "../../db";
import { Model, DataTypes, NUMBER } from "sequelize";
import { LeaveModel } from "../Leave/model";

export enum ROLE {
  HR = "HR",
  EMPLOYEE = "EMPLOYEE",
}
export enum JOBTITLE {
  UI_UX = "UI/UX",
  SOFTWARE_ENGINEER = "SOFTWARE_ENGINEER",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  DATA_ANALYTICS = "DATA_ANALYTICS",
}
export enum Department {
  Audit = "Audit",
  Tech = "Tech",
  Finance = "Finance",
}
export enum EmploymentStatus {
  INTERN = "INTERN",
  MEMBER = "MEMBER",
  TEAM_LEAD = "TEAM_LEAD",
}

export interface User {
  id: string;
  firstName: string;
  active: boolean;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: ROLE;
  employee_Department: Department;
  isEmployee: boolean;
  resetPasswordExpiration?: number | null;
  resetPasswordStatus?: boolean;
  resetPasswordCode: string | null;
  loginCount: number | null;
  loginRetrival: number | null;
  createdAt?: Date;
  DateOfBirth: Date | null;
  isTeamLead: boolean;
  employee_Status: EmploymentStatus;
  JobTitle: JOBTITLE;
  nameOfEmergencyContact: string | null;
  relationshipWithEmergencyContact: string | null;
  phoneNumberOfEmergencyContact: string | null;
  employeeId: string;
  preferredName: string;
  DateOfEmployment: Date | null;
  WorkLocation: string | null;
  salary: string | null;
  workSchedule: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  image: string;
  address: string;
  City_State: string;
  Zip_code: number;
  endTime: string;
  startTime: string;
  // [x: string]: string | number | boolean | Date | null;
}

export class UserModel extends Model<User> {
  // [x: string]: string;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employee_Status: {
      type: DataTypes.ENUM(...Object.values(EmploymentStatus)),
      allowNull: true,
    },

    role: {
      type: DataTypes.ENUM(...Object.values(ROLE)),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    resetPasswordExpiration: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
    },
    resetPasswordStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    resetPasswordCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employee_Department: {
      type: DataTypes.ENUM(...Object.values(Department)),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    preferredName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    DateOfEmployment: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    WorkLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    workSchedule: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    accountNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    accountName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isEmployee: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    DateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isTeamLead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    JobTitle: {
      type: DataTypes.ENUM(...Object.values(JOBTITLE)),
      allowNull: true,
    },

    nameOfEmergencyContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    relationshipWithEmergencyContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phoneNumberOfEmergencyContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    loginCount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    loginRetrival: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    City_State: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Zip_code: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  { sequelize, tableName: "user" }
);
