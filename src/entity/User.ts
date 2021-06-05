import { Directive, Field, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './Task';

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

  @Field({ nullable: true })
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

  @Field(() => Role)
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
