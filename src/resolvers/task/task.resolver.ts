import {
  Arg,
  Ctx,
  FieldResolver,
  Info,
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
import { getRepository } from 'typeorm';
import { doesPathsExist } from '../../utils/doesPathExist';

@Resolver(Task)
export default class TaskResolver {
  @Mutation(() => Task)
  @UseMiddleware(isAuth, isVerified)
  async createTask(
    @Arg('input') { title, description }: CreateTaskInput,
    @Ctx() ctx: MyContext,
  ) {
    const task = await Task.create({
      title,
      description,
      userId: ctx.req.session.userId,
    }).save();

    return task;
  }

  @FieldResolver(() => User)
  user(@Root() task: Task, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(task.userId);
  }

  @Query(() => [Task])
  @UseMiddleware(isAuth)
  async getAllTasks() {
    const tasks = await Task.find({});
    return tasks;
  }

  // @Query(() => [Task])
  // @UseMiddleware(isAuth)
  // async getAllTasks(@Info() info: any) {
  //   const shouldJoin = doesPathsExist(
  //     info.fieldNodes[0].selectionSet.selections,
  //     ['user'],
  //   );

  //   const query = getRepository(Task).createQueryBuilder('task');

  //   if (shouldJoin) {
  //     query.leftJoinAndSelect('task.user', 'user');
  //   }
  //   const tasks = await query.getMany();

  //   for (const t of tasks) {
  //     console.log('user : ', t.user.id);
  //   }
  //   return tasks;
  // }
}
