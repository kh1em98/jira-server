import bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { Task } from '../entity/Task';
import { RegisterInput } from '../resolvers/user/register/RegisterInput';
import {
  getConnection,
  getManager,
  getRepository,
  createConnection,
} from 'typeorm';
import { Role, User } from '../entity/User';
import { EmailExistedError } from '../resolvers/user/register/Register.resolver';
import { isAdmin } from './User';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { UnauthorizedError } from 'type-graphql';
import { Connection } from 'typeorm';
import { pubsubRedis } from '../utils/createSchema';

enum CursorType {
  PREVIOUS = 'previous',
  NEXT = 'next',
}

const deserializeCursor = (cursor: string): string[] => {
  return cursor.split('__');
};

export const generateTaskModel = (currentUser: User | undefined) => ({
  getAll: async (take: number, cursor: string) => {
    if (!currentUser) {
      return [];
    }

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
  },

  getTasksFromBoard: async (boardId: number) => {
    const creatorId = await getConnection().query(
      `
        select creatorId from public."board"
        where id = $1
      `,
      [boardId],
    );

    if (creatorId !== currentUser?.id || !isAdmin(currentUser)) {
      throw new ForbiddenError('no rights to access');
    }

    return Task.find({
      where: {
        boardId,
      },
    });
  },
  getById: async (id: number) => {
    try {
      return await Task.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  getTasksFromUser: async (userId) => {
    try {
      return await Task.find({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  async assignTaskToUser({ taskId, userId }) {
    try {
      const findTask = Task.findOne({
        where: {
          id: taskId,
        },
      });

      const findUser = User.findOne({
        where: {
          id: userId,
        },
      });

      const task = await findTask;
      const user = await findUser;

      if (task && user) {
        const connection = await getConnection();
        const result = await connection
          .createQueryBuilder()
          .relation(Task, 'assigners')
          .of(task)
          .add(userId);

        console.log(`publish USER-${userId}-BE-ASSIGNED`);

        await pubsubRedis.publish(`USER-${userId}-BE-ASSIGNED`, task);

        return task;
      }
      throw new Error("can't find user or task");
    } catch (error) {
      console.log('assign error : ', error);
      throw new UnauthorizedError();
    }
  },
  create: async ({ title, description, boardId }) => {
    try {
      const task = new Task();

      Object.assign(task, { title, description, boardId });

      task.userId = currentUser?.id || 11;
      task.assigners = Promise.resolve([]);

      const connection = await getConnection();
      await connection.manager.save(task);

      return task;
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteById: async (id: number) => {
    try {
      await Task.delete(id);
      return true;
    } catch (error) {
      return false;
    }
  },
});
