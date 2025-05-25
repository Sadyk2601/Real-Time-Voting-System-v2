import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Poll } from './poll.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => Poll, (poll) => poll.options, { onDelete: 'CASCADE' })
  poll: Poll;
}
