import { Model, DataTypes } from "sequelize";
import sequelize from "../../db";
import { ProjectModel } from "../project/model";
import { UserModel } from "../User/model";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "review" | "completed";
  assignedTo: string;
  timeline: Date;
  projectId: string;
}

export class TaskModel extends Model<Task> {}

TaskModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "progress", "completed"),
      defaultValue: "pending",
    },
    assignedTo: {
      type: DataTypes.UUID,
    },
    timeline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.UUID,
    },
  },
  { sequelize, tableName: "task" }
);

ProjectModel.hasMany(TaskModel, {
  foreignKey: "projectId", // Define the foreign key used in the TaskModel
  as: "task", // Renaming the association to avoid conflicts
  constraints:false
});

TaskModel.belongsTo(ProjectModel, {
  foreignKey: "projectId", // Use the same foreign key used in the association
  as: "project", // Renaming the association to avoid conflicts
  constraints:false
});
TaskModel.belongsTo(UserModel, {
  foreignKey: "assignedTo",
  as: "assignedUser",
  constraints:false
});
