import { User } from './../../entity/User';
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';

import { Task } from '../../entity/Task';
import { CreateTaskInput } from './createTaskInput';
import { isAuth, isVerified } from '../../middlewares/isAuth.middleware';
import { MyContext } from '../../types/MyContext';
import { getRepository } from 'typeorm';
import { PaginationArgs } from '../../shared/PaginationArgs';

@Resolver(Task)
export default class TaskResolver {
  // Solve N+1 problem by use join
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
  async getAllTasks(@Args() { skip, take, reverse }: PaginationArgs) {
    const query = getRepository(Task).createQueryBuilder('task').skip(skip);
    if (reverse) {
      query.orderBy('id', 'DESC');
    }

    if (take) {
      query.take(take);
    }

    const tasks = await query.getMany();

    console.log('tasks : ', tasks);

    return tasks;
  }

  @Query(() => Task)
  @UseMiddleware(isAuth)
  async async(@Arg('id') id: string) {
    const task = await Task.findOne({
      where: {
        id: parseInt(id, 10),
      },
    });

    return task;
  }
}
