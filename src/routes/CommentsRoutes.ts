import * as express from "express";
import { commentsController } from "../controllers";
import { IRequest } from "../interfaces/IRequest";

class CommentsRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.post("/", (req: IRequest, res: express.Response) =>
      commentsController.insertComment(req, res)
    );
    this.router.put("/", (req: IRequest, res: express.Response) =>
      commentsController.editComment(req, res)
    );
    this.router.delete("/", (req: IRequest, res: express.Response) =>
      commentsController.deleteComment(req, res)
    );
    this.router.get("/:postId", (req: IRequest, res: express.Response) =>
      commentsController.getCommentsByPost(req, res)
    );
  }
}

export const commentsRoutes = new CommentsRoutes().router;