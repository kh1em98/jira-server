import { User } from './../entity/User';
import { Request, Response } from 'express';
import { createUserLoader } from '../utils/createUserLoader';
import { generateUserModel } from '../models/User';
import { generateTaskModel } from '../models/Task';
import { generateBoardModel } from '../models/Board';

export interface MyContext {
  req: Request;
  res: Response;
  currentUser: User | undefined;
  userLoader: ReturnType<typeof createUserLoader>;
  models: {
    User: ReturnType<typeof generateUserModel>;
    Task: ReturnType<typeof generateTaskModel>;
    Board: ReturnType<typeof generateBoardModel>;
  };
}
