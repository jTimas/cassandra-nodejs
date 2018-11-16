import * as isEmail from 'email-validator';
import * as md5 from 'md5';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { cassandraService } from '../services';
import { config } from '../helpers/config';

export class AuthController {
  public signupUser(req: Request, res: Response) {
    let query1 = 'INSERT INTO users (email, userName, displayName, birthDate, createdAt, password) VALUES (?, ?, ?, ?, toTimeStamp(now()), ?)';
    let query2 = 'INSERT INTO users_by_displayname (name, createdAt, displayName, userName) VALUES (?, toTimeStamp(now()), ?, ?)';
    let query3 = 'INSERT INTO users_by_username (userName, displayName, createdAt, birthDate, password) VALUES (?, ?, toTimeStamp(now()), ?, ?)';
    const password = md5(req.body.password);
    const queries = [
        { query: query1, params: [ req.body.email, req.body.userName, req.body.displayName, req.body.birthDate, password ] },
        { query: query2, params: [ req.body.displayName.slice(0, 2).toLowerCase(), req.body.displayName, req.body.userName ] },
        { query: query3, params: [ req.body.userName, req.body.displayName, req.body.birthDate, password ] }
    ];
    cassandraService.client.batch(queries, { prepare: true }, function(error) {
        if (error) {
            res.status(400).send({ message: 'Error' });
        } else {
            res.status(200).send({ message: 'OK' });
        }
    });
  }
  
  public handleLogin(req: Request, res: Response) {
    let query = isEmail.validate(req.body.login) ? 
        'SELECT username, password FROM users WHERE email = ?' :
        'SELECT username, password FROM users_by_username WHERE username = ?';
        
    cassandraService.client.execute(query, [req.body.login])
        .then(result => {
            if(result.rows[0] !== undefined && result.rows[0].password === md5(req.body.password)) {
              res.status(200).send({
                    token: jwt.sign({
                        name: result.rows[0].username
                    }, config.secret, { expiresIn: 3600*24 })
                });
            } else {
              res.status(400).send({ message: 'Wrong password' });
            }
        });
  }
}

export const authController = new AuthController();