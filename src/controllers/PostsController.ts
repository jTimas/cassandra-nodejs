import { Response } from "express";
import { cassandraService } from "../services";
import { IRequest } from "../interfaces/IRequest";

export class PostsController {
  public getAllPosts(res: Response) {
    let query = 'SELECT * FROM posts';
    cassandraService.client.execute(query)
      .then(result => {
        res.status(200).send(result.rows);
      });
  }

  public getPostsByAuthor(author: string, res: Response) {
    let query = 'SELECT * FROM posts_by_author WHERE author = ?';
    cassandraService.client.execute(query, [author])
      .then(result => {
        res.status(200).send(result.rows);
      });
  }

  public getPost(postId: string, res: Response) {
    let query = 'SELECT * FROM posts WHERE id = ?';
    cassandraService.client.execute(query, [postId])
      .then(result => {
        res.status(200).send(result.rows[0]);
      });
  }

  public addPost(req: IRequest, res: Response) {
    let query1 = 'INSERT INTO posts (id, createdat, author, content, likes) VALUES (now(), toTimeStamp(now()), ?, ?, [])';
    let query2 = 'INSERT INTO posts_by_author (id, createdat, author, content, likes) VALUES (now(), toTimeStamp(now()), ?, ?, [])';
    let params = [
        req.user.name,
        req.body.content
    ];
    let queries = [
      { query: query1, params: params },
      { query: query2, params: params }
    ]
    cassandraService.client.batch(queries, function(error) {
        if (error) {
            res.status(400).send({ message: 'Error' });
        } else {
            res.status(200).send({ message: 'OK' });
        }
    });
  }

  public editPost(req: IRequest, res: Response) {
    let query = 'UPDATE posts SET content = ?, likes = ? WHERE id = ? IF author = ?';
    cassandraService.client.execute(query, [
        req.body.content,
        req.body.likes,
        req.body.id,
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

export const postsController = new PostsController();