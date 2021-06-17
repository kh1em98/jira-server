import 'apollo-cache-control';
import {
  Arg,
  Args,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from 'type-graphql';
import { Task } from '../../entity/Task';
import { isAuth } from '../../middlewares/isAuth.middleware';
import { PaginationArgs } from '../../shared/PaginationArgs';
import { MyContext } from '../../types/MyContext';
import { User } from './../../entity/User';
import { CreateTaskInput } from './createTaskInput';
import { getManager } from 'typeorm';
import { UnauthorizedError } from 'type-graphql';
import { redisSub } from '../../redis';
import { pubsubRedis } from '../../utils/createSchema';

// const TaskBaseResolver = queryBaseResolver('Task', Task);
// export default class TaskResolver extends TaskBaseResolver {

@ObjectType()
class PaginatedTasks {
  @Field(() => [Task])
  tasks: Task[];

  @Field()
  hasMore: boolean;
}

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

  @Query(() => Task)
  getTaskById(@Arg('id') id: number, @Ctx() { models }) {
    return models.Task.getById(id);
  }

  @Mutation(() => Task)
  @UseMiddleware(isAuth)
  async createTask(
    @Arg('input') { title, description, boardId }: CreateTaskInput,
    @Ctx() { models }: MyContext,
  ) {
    const task = await models.Task.create({ title, description, boardId });

    return task;
  }

  @Mutation(() => Task)
  @UseMiddleware(isAuth)
  async assignTaskForUser(
    @Arg('userId') userId: number,
    @Arg('taskId') taskId: number,
    @Ctx() { models }: MyContext,
  ) {
    return models.Task.assignTaskToUser({ userId, taskId });
  }

  @FieldResolver(() => User)
  user(@Root() task: Task, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(task.userId);
  }

  @FieldResolver(() => User)
  async assigners(@Root() task: Task, @Ctx() { userLoader }: MyContext) {
    const manger = getManager();

    const assignerIds = await manger.query(
      `
      select "userId" 
      from public."task_assigners_user"
      where "taskId" = $1
    `,
      [task.id],
    );

    console.log('assigners id : ', assignerIds);

    return userLoader.loadMany(assignerIds);
  }

  @Query(() => PaginatedTasks)
  getAllTasks(
    @Args() { take, cursor }: PaginationArgs,
    @Ctx() { models }: MyContext,
  ) {
    return models.Task.getAll(take, cursor);
  }

  @Mutation(() => Boolean)
  deleteTaskById(@Arg('id') id: number, @Ctx() { models }: MyContext) {
    return models.Task.deleteById(id);
  }

  @Subscription({
    subscribe: (root, args, context, info) => {
      return pubsubRedis.asyncIterator([
        `USER-${context.currentUserId}-BE-ASSIGNED`,
      ]);
    },
  })
  meBeAssigned(@Root() payload: Task): Task {
    return payload;
  }
}
