import { Request, Response } from "express";
import { loginUserSchema, option } from "../utils/utils";
import { UserModel } from "../component/User/model";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const jwtsecret = process.env.JWT_SECRET as string;

export const Login = async (req: Request, res: Response) => {
  const { email, name, password, confirm_password } = req.body;
  const iduuid = uuidv4();

  const validateResult = loginUserSchema.validate(req.body, option);

  if (validateResult.error) {
    res.status(400).json({ error: validateResult.error.details[0].message });
  }

  const User = (await UserModel.findOne({
    where: { email: email },
  })) as unknown as { [key: string]: string };

  const { id } = User;

  const validUser = await bcrypt.compare(password, User.password);

  if (validUser) {
    const token = jwt.sign({ _id: User._id }, jwtsecret, { expiresIn: "30d" });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      msg: "User login successful",
      User,
      token,
    });
  }
  return res.status(400).json({
    error: "Invalid email/ password inputed",
  });
};
