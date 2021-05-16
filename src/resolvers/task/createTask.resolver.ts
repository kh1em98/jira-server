import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';

import { User } from '../../entity/User';
import { Task } from '../../entity/Task';
import { CreateTaskInput } from './createTaskInput';
import { isAuth, isVerified } from '../../middlewares/isAuth.middleware';
import { MyContext } from '../../types/MyContext';

@Resolver(Task)
export default class CreateTaskResolver {
  @Mutation(() => Task)
  @UseMiddleware(isAuth, isVerified)
  async createTask(
    @Arg('input') { title, description }: CreateTaskInput,
    @Ctx() ctx: MyContext,
  ) {
    const task = await Task.create({
      title,
      description,
      user: ctx.req.session.user,
    }).save();

    return task;
  }

  @Query(() => [Task])
  @UseMiddleware(isAuth)
  async getAllTasks() {
    const tasks = await Task.find({});
    return tasks;
  }

  @FieldResolver(() => User)
  user(@Root() task: Task, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(task.userId);
  }
}
