import * as express from "express";
import { postsController } from "../controllers";
import { IRequest } from "../interfaces/IRequest";

class PostsRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get("/", (req: express.Request, res: express.Response) =>
      postsController.getAllPosts(res)
    );
    this.router.post("/", (req: IRequest, res: express.Response) =>
      postsController.addPost(req, res)
    );
    this.router.put("/", (req: IRequest, res: express.Response) =>
      postsController.editPost(req, res)
    );
    this.router.get("/:postId", (req: express.Request, res: express.Response) =>
      postsController.getPost(req.params.postId, res)
    );
    this.router.get("/author/:author", (req: express.Request, res: express.Response) =>
      postsController.getPostsByAuthor(req.params.author, res)
    );
  }
}

export const postsRoutes = new PostsRoutes().router;