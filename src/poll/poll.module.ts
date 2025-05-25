import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollService } from './poll.service';
import { PollResolver } from '../graphql/resolvers/poll.resolver';
import { Poll } from '../poll/poll.entity';
import { Vote } from '../vote/vote.entity';
import { PollController } from './poll.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, Vote])],
  controllers: [PollController],
  providers: [PollService, PollResolver],
  exports: [PollService],
})
export class PollModule {}
