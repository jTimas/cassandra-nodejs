import * as express from "express";
import * as bodyParser from "body-parser";
import { mainRoutes } from "./routes/MainRoutes";
import { authMiddleware } from "./middlewares";
import { commentsRoutes, postsRoutes, authRoutes, userRoutes } from "./routes";

class App {
  public app: express.Application;
  public router: express.Router = express.Router();

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use("/", mainRoutes);
    this.app.use("/auth", authRoutes);
    this.app.use("/user", authMiddleware, userRoutes);
    this.app.use("/posts", authMiddleware, postsRoutes);
    this.app.use("/comments", authMiddleware, commentsRoutes);
  }
}

export default new App().app;
