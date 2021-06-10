import 'apollo-cache-control';
import {
  Arg,
  Args,
  Ctx,
  Field,
  FieldResolver,
  Info,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { isAuth } from '../../middlewares/isAuth.middleware';
import { PaginationArgs } from '../../shared/PaginationArgs';
import { MyContext } from '../../types/MyContext';
import { Board } from './../../entity/Board';
import { User } from './../../entity/User';
import { getConnection } from 'typeorm';

// const TaskBaseResolver = queryBaseResolver('Task', Task);
// export default class TaskResolver extends TaskBaseResolver {

@Resolver(Board)
export default class BoardResolver {
  @FieldResolver(() => User)
  creator(@Root() board: Board, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(board.creatorId);
  }

  @FieldResolver(() => [User])
  async assigners(@Root() board: Board, @Ctx() { userLoader }: MyContext) {
    const assigners = await getConnection().query(
      `
      SELECT * from public."user" u
      LEFT JOIN public."board_assigners_user" bau
      ON u.id = bau."userId"
      WHERE bau."boardId" = $1
    `,
      [board.id],
    );

    return assigners;
  }

  @Query(() => Board)
  getBoardById(@Arg('id') id: number, @Ctx() { models }: MyContext) {
    return models.Board.getById(id);
  }

  @Mutation(() => Board)
  @UseMiddleware(isAuth)
  async createBoard(@Arg('title') title: string, @Ctx() { models }: MyContext) {
    return models.Board.create({ title });
  }

  // @UseMiddleware(isAuth)
  // @Query(() => PaginatedTasks)
  // getAllTasks(
  //   @Args() { take, cursor }: PaginationArgs,
  //   @Ctx() { models }: MyContext,
  //   @Info() info,
  // ) {
  //   info.cacheControl.setCacheHint({ maxAge: 180, scope: 'PUBLIC' });
  //   return models.Task.getAll(take, cursor);
  // }

  // @Mutation(() => Boolean)
  // deleteTaskById(@Arg('id') id: number, @Ctx() { models }: MyContext) {
  //   return models.Task.deleteById(id);
  // }
}
