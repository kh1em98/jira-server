import { PaginationArgs } from './../shared/PaginationArgs';
import { Arg, Args, ClassType, Int, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';

export function createBaseResolver<T extends ClassType>(
  suffix: string,
  objectTypeCls: T,
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    protected items: T[] = [];

    @Query((type) => [objectTypeCls], { name: `getAll${suffix}` })
    async getAll(
      @Args() { skip, take, reverse }: PaginationArgs,
    ): Promise<T[]> {
      const query = getRepository(objectTypeCls)
        .createQueryBuilder(suffix)
        .skip(skip);

      if (reverse) {
        query.orderBy('id', 'DESC');
      }

      if (take) {
        query.take(take);
      }

      const items = await query.getMany();

      return items;
    }
  }

  return BaseResolver;
}
