import { Request, Response } from "express";
import {
  createPayriseRequest,
  option,
  updatePayriseRequest,
} from "../../utils/utils";
import { PayriseModel } from "./model";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../../lib/helper/cloudinary";

export const createPayrise = async(req:Request | any, res:Response) => {
try {
  const verified = req.user;
  const id = uuidv4()
const validateResult = createPayriseRequest.validate(req.body, option);
 
if (validateResult.error) {
  return res.status(400).json({Error: validateResult.error.details[0].message});     
}
 
const PayriseRecord = await PayriseModel.create({
   id,
   ...req.body,
//    userId: verified.id
})
 
  return res.status(201).json({msg: 'Payrise request created successfully', PayriseRecord})
} catch (err) {
  console.log(err);
}
};
 
export const getPayrise = async (req: Request, res: Response) => {
  const getAllPayrise = await PayriseModel.findAndCountAll();

  return res.status(201).json({
    msg: "You have successfully retrieved all data",
    count: getAllPayrise.count,
    payRise: getAllPayrise.rows,
  });
};

export const updatePayrise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validateResult = updatePayriseRequest.validate(req.body, option);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ error: validateResult.error.details[0].message });
    }

    const update = await PayriseModel.findOne({ where: { id: id } });

    if (!update) {
      return res.status(400).json({
        error: "Non-existing Payrise Request",
      });
    }
    const updateRecord = await update.update({ ...req.body });

    return res.status(201).json({
      msg: "Update Successful",
      updateRecord,
    });
  } catch (err) {
    console.log(err);
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
