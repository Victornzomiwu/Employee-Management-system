import sequelize from "../../db";
import { DataTypes, Model } from "sequelize";
import { UserModel } from "../User/model";

export interface Project {
  startDate: Date;
  endDate: Date;
  projectTitle: string;
  description: string;
  projectStatus: "High" | "Low";
  OwnerId: string;

  id: string;
  //   Task: string[];
}

export class ProjectModel extends Model<Project> {}

ProjectModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    projectTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectStatus: {
      type: DataTypes.ENUM("High", "Low"),
      allowNull: false,
    },
    OwnerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // Task: {
    //   type: DataTypes.ARRAY(DataTypes.UUID),
    //   allowNull: true,
    // },
  },
  { sequelize, tableName: "project" }
);
//relationship between project and user
// UserModel.belongsToMany(ProjectModel, {
//   through: "members", // Replace with your desired join table name
//   foreignKey: "userId", // Foreign key column in the join table referencing UserModel
//   otherKey: "projectId", // Array column in the join table referencing ProjectModel
//   as: "user",
//   constraints:false
// });

// ProjectModel.belongsToMany(UserModel, {
//   through: "members",
//   foreignKey: "projectId",
//   otherKey: "userId",
//   as: "project",
//   constraints:false
// });
// UserModel.belongsToMany(ProjectModel, {
//   through: "members",
//   foreignKey:"userId",
//   as: "projects",
// });

// ProjectModel.belongsToMany(UserModel, {
//   through: "members",
//   foreignKey: "projectId",
//   as: "users",
// });
