import * as express from "express";
import { userController } from "../controllers";

class UserRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get("/list", (req: express.Request, res: express.Response) =>
      userController.getAllUsers(res)
    );
    this.router.get("/:username", (req: express.Request, res: express.Response) =>
      userController.getUser(req, res)
    );
    this.router.get("/list/:name", (req: express.Request, res: express.Response) =>
      userController.getUsersByName(req, res)
    );
  }
}

export const userRoutes = new UserRoutes().router;