import { getRepository } from 'typeorm';
import { User } from './../../entity/User';
import {
  Arg,
  Args,
  Ctx,
  Directive,
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
    @Ctx() { models }: MyContext,
  ) {
    return models.Task.create({ title, description });
  }

  @FieldResolver(() => User)
  user(@Root() task: Task, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(task.userId);
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
}
