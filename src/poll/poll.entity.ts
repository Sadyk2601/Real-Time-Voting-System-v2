// poll.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Vote } from 'src/vote/vote.entity';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column('simple-array')
  options: string[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.polls)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Vote, (vote) => vote.poll)
  votes: Vote[];
}
