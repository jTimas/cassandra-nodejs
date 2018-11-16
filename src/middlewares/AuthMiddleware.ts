import * as jwt from 'jsonwebtoken';
import { config } from '../helpers/config';

export function authMiddleware (req, res, next) {
    if( req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization') ) {
        try {
            req.user = jwt.verify(req.headers['authorization'], config.secret);
        } catch(err) {
            return res.status(401).json({
                error: {
                    message: 'Failed to authenticate token!'
                }
            });
        }
    } else {
        return res.status(401).json({
            error: {
                message: 'No token!'
            }
        });
    }
    next();
    return;
};