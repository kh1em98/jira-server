import bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { Task } from '../entity/Task';
import { RegisterInput } from '../resolvers/user/register/RegisterInput';
import { getConnection, getRepository } from 'typeorm';
import { Role, User } from '../entity/User';
import { EmailExistedError } from '../resolvers/user/register/Register.resolver';
import { isAdmin } from './User';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

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
  create: async ({ title, description, boardId }) => {
    try {
      const task = await Task.create({
        title,
        description,
        userId: currentUser?.id,
        boardId,
      }).save();

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
