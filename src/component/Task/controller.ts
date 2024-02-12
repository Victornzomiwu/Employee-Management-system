import { Request, Response } from "express";
import { CreateTaskSchema, assignTaskSchema, option, updateTaskRequest } from "../../utils/utils";
import { TaskModel } from "./model";
import { v4 as uuidv4 } from "uuid";
import { ProjectModel } from "../project/model";
import { User, UserModel } from "../User/model";

export const createTask = async (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const { error, value } = CreateTaskSchema.validate(req.body, option);
    const project = await ProjectModel.findByPk(req.body.projectId);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    if (!project) {
      return res.status(400).json({ error: "no project found" });
    }


    const taskRecord = await TaskModel.create({
      ...value,
      id,
    });

    return res
      .status(200)
      .json({ msg: "Task assigned successfully", taskRecord });
  } catch (err) {
    console.log(err);
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await TaskModel.findAndCountAll();

    return res.status(201).json({
      msg: "You have successfully retrieved all data",
      count: task.count,
      todo: task.rows,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getTaskProject = async (req: Request, res: Response) => {
  try {
    // const task = await ProjectModel.findByPk(req.params.id, {
    //   include: [
    //     {
    //       model: TaskModel,
    //       as: "task",
    //       //populate assignedTo
    //       include: [
    //         {
    //           model: UserModel,
    //           as: "assignedUser",
    //         },
    //       ],
    //     },
    //   ],
    // });
    const task = await TaskModel.findOne({where:{projectId:req.params.id}, include:["project","assignedUser"]})
    return res.status(201).json({
      msg: "You have successfully retrieved all data",
      count: task,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export const getAllTaskProject = async (req: Request, res: Response) => {
  try {
    // const task = await ProjectModel.findAll({
    //   include: [
    //     {
    //       model: TaskModel,
    //       as: "task",
    //       //populate assignedTo
    //       include: [
    //         {
    //           model: UserModel,
    //           as: "assignedUser",
    //         },
    //       ],
    //     },
    //   ],
    // });
    const task = await TaskModel.findAll({ include:["project", "assignedUser"]})
    return res.status(201).json({
      msg: "You have successfully retrieved all data",
      task,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const AssignTask = async (req: Request | any, res: Response) => {
  try {
    const {error, value} = assignTaskSchema.validate(req.body, option)
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const task = await TaskModel.findByPk(req.params.id);
    if (!task) {
      return res.status(400).json({ error: "Task not found" });
    }
    const { assignedTo } = req.body;

    const user = (await UserModel.findByPk(assignedTo)) as unknown as User;
    if (!user) {
      return res.status(400).json({ error: "This employee does not exist" });
    }
    const teamLead = (await UserModel.findByPk(req.user)) as unknown as User;
    if (!teamLead) {
      return res.status(400).json({ error: "This team lead does not exist" });
    }
    if (user.employee_Department !== teamLead.employee_Department) {
      return res
        .status(400)
        .json({ error: "This employee is not on your team" });
    }
    const assignTask = await task.update({ assignedTo: req.body.assignedTo });
    return res.status(201).json({
      msg: "You have successfully assigned task",
      count: assignTask,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const validateResult = updateTaskRequest.validate(req.body, option);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ error: validateResult.error.details[0].message });
    }

    const Update = await TaskModel.findOne({ where: { id: req.params.id } });

    if (!Update) {
      return res.status(400).json({
        error: "Non-existing Task Request",
      });
    }
    const updateRecord = await Update.update({ ...req.body });
    //console.log("req.body", req.body);

    return res.status(201).json({
      msg: "Update Successful",
      updateRecord,
    });
  } catch (error) {
    console.log(error);
  }
};
