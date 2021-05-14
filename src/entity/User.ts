import { Field, ObjectType, Root } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column()
  email: string;

  @Column({
    default: false,
  })
  isFacebookAccount: boolean;

  @Column()
  password: string;

  @Field()
  @Column({
    default: 'https://d1c556z6rl45hi.cloudfront.net/khiem.png',
  })
  image: string;

  @Field({ nullable: true })
  nickName(@Root() user: User): string {
    return `${user.fullName}${Math.floor(Math.random() * 100)}`;
  }

  @Column({
    default: 0,
  })
  timesForceLogout: number;

  @Field()
  @Column({
    default: false,
  })
  verified: boolean;

  // @OneToMany(() => Task, (task) => task.creator)
  // tasksCreated: Task[];
}
