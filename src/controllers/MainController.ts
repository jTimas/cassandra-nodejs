import { Request, Response } from "express";

export class MainController {
  public root(req: Request, res: Response) {
    res.status(200).send('API is working!');
  }
}

export const mainController = new MainController();