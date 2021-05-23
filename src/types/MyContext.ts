import { Request, Response } from 'express';
import { createUserLoader } from '../utils/createUserLoader';
import { createTaskLoader } from '../utils/createTaskLoader';

export interface MyContext {
  req: Request;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  taskLoader: ReturnType<typeof createTaskLoader>;
}
