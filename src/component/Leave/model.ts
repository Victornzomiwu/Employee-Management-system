import { Model, DataTypes } from "sequelize";
import sequelize from "../../db";
import { UserModel } from "../User/model";

enum EmploymentStatus {
  INTERN = "INTERN",
  MEMBER = "MEMBER",
  TEAM_LEAD = "TEAM_LEAD",
}

enum Department {
  Tech = "Tech",
  HR = "HR",
  Audit = "Audit",
  Finance = "Finance",
}

enum Reason {
  Managed_Project = "Managed_Project",
  Vacation_Leave = "Vacation_Leave",
  Sick_Leave = "Sick_Leave",
  Personal_Leave = "Personal_Leave",
  Others = "Others",
}

export interface Leave {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  department: Department;
  startDate: Date;
  endDate: Date;
  reason: Reason;
  supervisorName: string;
  employmentStatus: EmploymentStatus;
  status: "approved" | "pending" | "rejected";
  comment?: string;
  totalLeaveDaysRequested?: number;
  userId: string;
  attachment: string;
}

export class LeaveModel extends Model<Leave> {}

LeaveModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    employeeId: {
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.ENUM(...Object.values(Department)),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.ENUM(...Object.values(Reason)),
      allowNull: false,
    },
    supervisorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employmentStatus: {
      type: DataTypes.ENUM(...Object.values(EmploymentStatus)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("approved", "pending", "rejected"),
      defaultValue: "pending",
    },
    comment: {
      type: DataTypes.BLOB("tiny"),
      allowNull: true,
    },
    totalLeaveDaysRequested: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
    },
    attachment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, tableName: "leave" }
);

UserModel.hasMany(LeaveModel, {
  foreignKey: "userId",
  as: "leave",
  constraints: false,
});
LeaveModel.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "user",

  constraints: false,
});
