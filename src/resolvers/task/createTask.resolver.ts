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

  // @Query(() => [Task])
  // @UseMiddleware(isAuth)
  // async getAllTasks() {
  //   const tasks = await Task.find({});
  //   return tasks;
  // }

  @Query(() => [Task])
  @UseMiddleware(isAuth)
  async getAllTasks(@Info() info: any) {
    const shouldJoin = doesPathsExist(
      info.fieldNodes[0].selectionSet.selections,
      ['user'],
    );

    const tasks = await getRepository(Task)
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .getMany();

    for (const t of tasks) {
      console.log('user : ', t.user.id);
    }
    return tasks;
  }

  // @FieldResolver(() => User)
  // user(@Root() task: Task, @Ctx() { userLoader }: MyContext) {
  //   return userLoader.load(task.userId);
  // }

  // @FieldResolver(() => User)
  // async user(@Root() task: Task) {}
}
