import * as express from "express";
import { authController } from "../controllers";

class AuthRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.post("/login", (req: express.Request, res: express.Response) =>
      authController.handleLogin(req, res)
    );
    this.router.post("/signup", (req: express.Request, res: express.Response) =>
      authController.signupUser(req, res)
    );
  }
}

export const authRoutes = new AuthRoutes().router;