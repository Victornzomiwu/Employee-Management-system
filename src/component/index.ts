import UserRouter from "./User/router";
import LeaveRouter from "./Leave/router";
import PayRise from "./payrise/router";
import ProjectRouter from "./project/router";
import TaskRouter from "./Task/router";



export = {
  user: {
    routes: UserRouter,
  },
  leave: {
    routes: LeaveRouter,
  },
  PayRise: {
    routes: PayRise,
  },
  project: {
    routes: ProjectRouter,
  },
  task: {
    routes: TaskRouter,
  }
};
