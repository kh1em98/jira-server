import { getRepository } from 'typeorm';
import { User } from './../../entity/User';
import {
  Arg,
  Args,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';

import { Task } from '../../entity/Task';
import { CreateTaskInput } from './createTaskInput';
import { isAuth } from '../../middlewares/isAuth.middleware';
import { MyContext } from '../../types/MyContext';
import { queryBaseResolver } from '../baseQuery';
import { PaginationArgs } from '../../shared/PaginationArgs';

enum CursorType {
  PREVIOUS = 'previous',
  NEXT = 'next',
}

const deserializeCursor = (cursor: string): string[] => {
  return cursor.split('__');
};

const TaskBaseResolver = queryBaseResolver('Task', Task);

@ObjectType()
class PaginatedTasks {
  @Field(() => [Task])
  tasks: Task[];

  @Field()
  hasMore: boolean;
}

@Resolver(Task)
export default class TaskResolver extends TaskBaseResolver {
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
  @UseMiddleware(isAuth)
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

  @Query(() => PaginatedTasks)
  async getAllTasks(@Args() { take, cursor }: PaginationArgs) {
    const realLimit = take ? take + 1 : 10;

    // Check if has more tasks
    const realLimitPlusOne = realLimit + 1;

    const query = getRepository(Task)
      .createQueryBuilder('task')
      .take(realLimitPlusOne);

    if (cursor) {
      const [type, payload] = deserializeCursor(cursor);

      if (type === CursorType.PREVIOUS) {
        query
          .where(`task."createdAt" < :payload`)
          .orderBy('task."createdAt"', 'DESC');
      } else if (type === CursorType.NEXT) {
        query
          .where(`task."createdAt" > :payload`)
          .orderBy('task."createdAt"', 'ASC');
      } else {
        throw new Error('Invalid cursor');
      }

      query.setParameters({ payload: new Date(parseInt(payload)) });
    }

    const tasks = await query.getMany();
    return {
      tasks: tasks.slice(0, realLimit),
      hasMore: tasks.length === realLimitPlusOne,
    };
  }
}
