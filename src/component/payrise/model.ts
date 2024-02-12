import { Model, DataTypes } from "sequelize";
import sequelize from "../../db";
import { UserModel } from "../User/model";

export enum Department {
  Tech = "Tech",
  HR = "HR",
  Audit = "Audit",
  Finance = "Finance",
}

export enum EmployeeStatus {
  Intern = "Intern",
  Junior = "Junior",
  Assistant_Manager = "Assistant Manager",
  Manager = "Manager",
}
export enum JOBTITLE {
  UI_UX = "UI/UX",
  SOFTWARE_ENGINEER = "SOFTWARE_ENGINEER",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  DATA_ANALYTICS = "DATA_ANALYTICS",
}

export interface PayRise {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  department: Department;
  EmployeeStatus: EmployeeStatus;
  jobTitle: JOBTITLE;
  DateOfHire: Date;
  currentPay: number;
  proposedPay: number;
  reasons: string;
  attachments: string;
  status: "Pending" | "Approved" | "Rejected";
  userId: string;
}

export class PayriseModel extends Model<PayRise> {}

PayriseModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    EmployeeStatus: {
      type: DataTypes.ENUM(...Object.values(EmployeeStatus)),
      allowNull: true,
    },
    department: {
      type: DataTypes.ENUM(...Object.values(Department)),
      allowNull: true,
    },

    jobTitle: {
      type: DataTypes.ENUM(...Object.values(JOBTITLE)),
      allowNull: true,
    },

    employeeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    DateOfHire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    currentPay: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    proposedPay: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reasons: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Approved", "Pending", "Rejected"),
      defaultValue: "Pending",
    },
  },
  { sequelize, tableName: "PayRise" }
);

UserModel.hasMany(PayriseModel, {
  foreignKey: "userId",
  as: "PayRise",
  constraints: false,
});

PayriseModel.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "user",
  constraints: false,
});
