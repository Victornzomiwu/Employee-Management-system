import { Request, Response } from "express";
import {
  AssignMemberSchema,
  ProjectSchema,
  UpdateProjectSchema,
  option,
} from "../../utils/utils";
import { Project, ProjectModel } from "./model";
import { v4 as uuidv4 } from "uuid";
import { ROLE, User, UserModel } from "../User/model";

export const CreateProject = async (req: Request | any, res: Response) => {
  try {
    const user = (await UserModel.findByPk(req.user)) as unknown as User;
    console.log(user.isTeamLead);
    if (!user.isTeamLead) {
      return res.status(401).json({ error: "unauthorized" });
    }
    const { error, value } = ProjectSchema.validate(req.body, option);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const id = uuidv4();
    const project = await ProjectModel.create({ ...value, id });

    return res.status(200).json({
      message: "Project Created Successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

export const GetProject = async (req: Request, res: Response) => {
  try {
    const project = await ProjectModel.findAll();
    return res.status(200).json({
      project,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};
export const UpdateProject = async (req: Request | any, res: Response) => {
  try {
    const user = (await UserModel.findByPk(req.user)) as unknown as User;
    console.log(user.isTeamLead);
    if (!user.isTeamLead) {
      return res.status(401).json({ error: "unauthorized" });
    }
    const { error, value } = UpdateProjectSchema.validate(req.body, option);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const { id } = req.params;
    const exist = await ProjectModel.findByPk(id);
    if (!exist) {
      return res.status(400).json({ error: "project not found" });
    }
    const project = await ProjectModel.update(value, {
      where: { id },
    });
    return res.status(200).json({
      message: "Project Updated Successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};



export const getAllProject = async (req: Request, res: Response) => {
try {
const project = await ProjectModel.findAll()
return res.status(200).json({project})
    
} catch (error) {
   return res.status(500).json({error})
    
}
};
