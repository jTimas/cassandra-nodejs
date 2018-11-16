import { Response } from "express";
import { cassandraService } from "../services";
import { IRequest } from "../interfaces/IRequest";

export class CommentsController {
  public insertComment(req: IRequest, res: Response) {
    let query = 'INSERT INTO comments (postid, id, createdat, author, comment) VALUES (?, now(), toTimeStamp(now()), ?, ?)';
    cassandraService.client.execute(query, [
      req.body.postId,
      req.user.name,
      req.body.comment
    ], function(error) {
        if (error) {
          res.status(400).send({ message: 'Error' });
        } else {
          res.status(200).send({ message: 'OK' });
        }
    });
  }

  public getCommentsByPost(req: IRequest, res: Response) {
    let query = 'SELECT * FROM comments WHERE postid = ?';
    cassandraService.client.execute(query, [req.params.postId])
      .then(result => {
        res.status(200).send(result.rows);
      });
  }
  
  public editComment(req: IRequest, res: Response) {
    let query = 'UPDATE comments SET comment = ? WHERE postid = ? and createdat = ? IF author = ?';
    console.log(req.body)
    cassandraService.client.execute(query, [
        req.body.comment,
        req.body.postId,
        new Date(req.body.createdAt),
        req.user.name
      ], function(error, response) {
        if (error) {
          console.log(error);
          res.status(400).send({ message: 'Error' });
        } else {
          if(response.rows[0]['[applied]'])
            res.status(200).send({ message: 'OK' });
          else
            res.status(400).send({ message: 'Error' });
        }
    });
  }
  
  public deleteComment(req: IRequest, res: Response) {
    let query = 'DELETE FROM comments WHERE postid = ? and createdat = ? IF author = ?';
    cassandraService.client.execute(query, [
        req.body.postId,
        new Date(req.body.createdAt),
        req.user.name
    ], function(error, response) {
        if (error) {
          res.status(400).send({ message: 'Error' });
        } else {
          if(response.rows[0]['[applied]'])
            res.status(200).send({ message: 'OK' });
          else
            res.status(400).send({ message: 'Error' });
        }
    });
  }
}

export const commentsController = new CommentsController();