import { Board } from './../entity/Board';
import { User } from '../entity/User';
import { isAdmin } from './User';
import { getConnection, getManager } from 'typeorm';
import { ForbiddenError } from 'apollo-server-express';

const txDeleteBoard = async (boardId: number) => {
  await getConnection().transaction(async (tm) => {
    await tm.query(
      `
        delete from public."task"
        where "boardId" = $1
      `,
      [boardId],
    );

    await tm.query(
      `
      delete from public."board"
      where id = $1
    `,
      [boardId],
    );
  });
};

export const generateBoardModel = (currentUser: User | undefined) => ({
  getAll: () => {
    if (isAdmin(currentUser)) {
      return Board.find({});
    }
    throw new ForbiddenError('not have rights to access');
  },
  getById: async (id: number) => {
    const board = await Board.findOne({ where: { id } });
    if (isAdmin(currentUser) || board?.creatorId === currentUser?.id) {
      return board;
    }
    throw new ForbiddenError('not have rights to access');
  },

  getBoardsCurrentUser: () => {
    return Board.find({
      where: {
        creatorId: currentUser?.id,
      },
    });
  },

  getBoardsFromUser: (userId) => {
    if (isAdmin(currentUser)) {
      return Board.find({
        where: {
          creatorId: userId,
        },
      });
    }
    throw new ForbiddenError('not have rights to access');
  },

  create: async ({ title }) => {
    if (!currentUser || isAdmin(currentUser)) {
      throw new ForbiddenError('no have rights to access');
    }

    const board = new Board();
    board.title = title;
    board.creator = currentUser;
    board.joiners = [currentUser];

    const entityManager = getManager();
    await entityManager.save(board);
    return board;
  },
  deleteById: async (id: number) => {
    if (isAdmin(currentUser)) {
      return txDeleteBoard(id);
    }

    const board = await Board.findOne({ where: { id } });
    if (board?.creatorId === currentUser?.id) {
      return txDeleteBoard(id);
    }

    throw new ForbiddenError('not have rights to access');
  },
});
