import {Router} from "express"
import { createPayrise, getPayrise, imageUpload, updatePayrise} from "./payriseController";
import { AuthMiddleware } from "../../lib/middleware/auth";
import upload from "../../lib/helper/multer";



const router = Router()
router.post("/create-pay",AuthMiddleware.Authenticate(["HR","EMPLOYEE"]), createPayrise);
router.get("/get-pay", AuthMiddleware.Authenticate(["HR", "EMPLOYEE"]), getPayrise)
router.patch("/update/pay/:id", AuthMiddleware.Authenticate(["HR","EMPLOYEE"]), updatePayrise)
router.post("/image", upload.single("image"), imageUpload)

export default router;
