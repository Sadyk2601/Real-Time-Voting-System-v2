import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Poll } from '../poll/poll.entity';
import { Vote } from '../vote/vote.entity';

export type UserRole = 'admin' | 'user';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Poll, (poll) => poll.createdBy)
  polls: Poll[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}
