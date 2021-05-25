import { Min } from 'class-validator';
import { Field, InputType, ClassType, Int, ArgsType } from 'type-graphql';

@ArgsType()
export class PaginationArgs {
  @Min(1)
  @Field(() => Int, { nullable: true })
  take: number;

  @Field(() => String, { nullable: true })
  cursor: string;
}

export const PaginationMixin = <T extends ClassType>(BaseClass: T) => {
  @InputType()
  class PaginationInput extends BaseClass {
    @Min(1)
    @Field(() => Int, { nullable: true })
    take: number;

    @Field(() => String, { nullable: true })
    cursor: string;
  }
  return PaginationInput;
};
