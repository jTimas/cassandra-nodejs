import { Request } from "express";

export interface IRequest extends Request {
    user: IUser;
}

interface IUser {
    name: string;
}