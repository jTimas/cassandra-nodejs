import { Request, Response } from "express";
import { cassandraService } from '../services';

export class UserController {
  public getAllUsers(res: Response) {
    let query = 'SELECT * FROM users';
    cassandraService.client.execute(query)
      .then(result => {
        res.status(200).send(result.rows);
      });
  }

  public getUsersByName(req: Request, res: Response) {
    let query = 'SELECT * FROM users_by_displayName WHERE name = ?';
    let name = req.params.name.slice(0, 2).toLowerCase();
    cassandraService.client.execute(query, [name])
      .then(result => {
        res.status(200).send(result.rows);
      });
  }

  public getUser(req: Request, res: Response) {
    let query = 'SELECT * FROM users_by_userName WHERE username = ?';
    cassandraService.client.execute(query, [req.params.username])
      .then(result => {
        res.status(200).send(result.rows[0]);
      });
  }
}

export const userController = new UserController();