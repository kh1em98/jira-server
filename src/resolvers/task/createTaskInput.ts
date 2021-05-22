import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateTaskInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;
}
