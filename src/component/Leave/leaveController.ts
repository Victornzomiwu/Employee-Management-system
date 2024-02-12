import { Request, Response } from "express";
import {
  createLeaveRequest,
  option,
  updateleaveRequest,
} from "../../utils/utils";
import { Leave, LeaveModel } from "./model";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../../lib/helper/cloudinary";
import { User, UserModel } from "../User/model";

export const createLeave = async (req: Request | any, res: Response) => {
  try {
    const verified = req.user;
    //console.log(verified)
    const id = uuidv4();
    const validateResult = createLeaveRequest.validate(req.body, option);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

    console.log("req.user:", req.user);

    // const user = (await UserModel.findOne(req.body)) as unknown as User
    // console.log("user", user)
    //     if(!user.employeeId) {
    //      return res.status(401).json({ error: "Invalid employeeId" });
    //     }

    const { employeeId } = req.body;

    const user = await UserModel.findOne({ where: { employeeId: employeeId } });
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    const leaveRecord = await LeaveModel.create({
      ...req.body,
      id,
    });

    return res
      .status(201)
      .json({ msg: "Leave request created successfully", leaveRecord });
  } catch (err) {
    console.log(err);
  }
};

export const getLeave = async (req: Request, res: Response) => {
  const getAllLeave = await LeaveModel.findAndCountAll();
  return res.status(201).json({
    msg: "You have successfully retrieved all data",
    count: getAllLeave.count,
    leave: getAllLeave.rows,
  });
};

export const updateLeave = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);

    const validateResult = updateleaveRequest.validate(req.body, option);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ error: validateResult.error.details[0].message });
    }

    const update = await LeaveModel.findOne({ where: { id: id } });

    if (!update) {
      return res.status(400).json({
        error: "Non-existing Leave Request",
      });
    }
    const updateRecord = await update.update({ ...req.body });

    return res.status(201).json({
      msg: "Update Successful",
      updateRecord,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const imageUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadedImage = await cloudinary.uploader.upload(req.file.path);

    res.status(200).json({ imageUrl: uploadedImage.secure_url });
  } catch (error) {
    res.status(500).json(error);
  }
};
