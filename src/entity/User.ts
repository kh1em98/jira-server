import { Field, ObjectType } from 'type-graphql';
import { Task } from './Task';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { registerEnumType } from 'type-graphql';

export enum Role {
  Admin = 'admin',
  User = 'user',
}

registerEnumType(Role, {
  name: 'Role', // this one is mandatory
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ type: 'varchar', unique: true })
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

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @Field()
  @Column({
    default: false,
  })
  verified: boolean;

  @Field((type) => Role)
  @Column({
    default: Role.User,
  })
  role: Role;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
