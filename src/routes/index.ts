import express, { Request, Response } from "express";
import component from "../component";

const router = express.Router();

router.get("/", (_: Request, res: Response) =>
  res.status(200).json({ message: "success" })
  );
router.use("/api", component.task.routes);
router.use("/api", component.user.routes);
router.use("/api", component.leave.routes);
router.use("/api", component.PayRise.routes);
router.use("/api", component.project.routes);

export default router;
