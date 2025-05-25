import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Poll } from '../poll/poll.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.votes, { eager: true })
  user: User;

  @ManyToOne(() => Poll, (poll) => poll.votes, { eager: true })
  poll: Poll;

  @Column()
  selectedOption: string;

  @CreateDateColumn()
  createdAt: Date;
}
