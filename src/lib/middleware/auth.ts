import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { User, UserModel } from "../../component/User/model";

const jwtsecret = process.env.JWT_SECRET 


export class AuthMiddleware {
  static Authenticate =
    (auth: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers["authorization"] as string;
        console.log(token);

        if (!token) {
          return res
            .status(401)
            .json({ error: "unauthorized, no token provided" });
        }
        const verified = Jwt.verify(token, process.env.JWT_SECRET!);
        if (!verified) {
          return res.status(401).json({ error: "unauthorized" });
        }
        const { id } = verified as JwtPayload;
        const user = (await UserModel.findOne({
          where: { id },
        })) as unknown as User;

        if (!auth.includes(user.role)) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = user.id;
        next();
      } catch (error) {
        return res.status(500).json({ error });
      }
    };
}


// import { UserModel } from "../../component/User/model";



/**----------API MIDDLEWARE--------------- */
export async function auth(req:Request | any , res:Response, next: NextFunction){
const authorization = req.headers.authorization

if(!authorization){
    res.status(401).json({error: "kindly sign in as a user"})
}
const token = authorization.slice(7, authorization.length);

// let verified = jwt.verify(token, jwtsecret);
const verified = Jwt.verify(token, process.env.JWT_SECRET!);
if(!verified){
    res.status(401).json({error: "Invalid token, you cant access this route"})
}

const {id} = verified as {[key:string] :string}

//check if user exist
const user = await UserModel.findOne({where:{id}});

if(!user){
    res.status(401).json({error: "Kindly signup as a user "})
}

  req.user = verified
  next()
}