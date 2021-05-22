import { Min } from 'class-validator';
import { Field, InputType, ClassType, Int, ArgsType } from 'type-graphql';

@ArgsType()
export class PaginationArgs {
  @Min(0)
  @Field(() => Int, { nullable: true })
  skip: number;

  @Min(1)
  @Field(() => Int, { nullable: true })
  take: number;

  @Field(() => Boolean, { defaultValue: false })
  reverse: boolean;
}

export const PaginationMixin = <T extends ClassType>(BaseClass: T) => {
  @InputType()
  class PaginationInput extends BaseClass {
    @Min(0)
    @Field(() => Int, { nullable: true })
    skip: number;

    @Min(1)
    @Field(() => Int, { nullable: true })
    take: number;

    @Field(() => Boolean, { defaultValue: false })
    reverse: boolean;
  }
  return PaginationInput;
};
