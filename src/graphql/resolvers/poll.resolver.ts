import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PollService } from '../../poll/poll.service';
import { PollType } from '../types/poll.type';
import { VoteInput } from '../mutation.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/user.entity';
import { PubSub } from 'graphql-subscriptions';

const pubSub: any = new PubSub();

@Resolver(() => PollType)
export class PollResolver {
  constructor(private pollService: PollService) {}

  @Query(() => [PollType])
  async polls() {
    return this.pollService.getActivePolls();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async vote(@Args('input') input: VoteInput, @CurrentUser() user: User) {
    const result = await this.pollService.vote(
      input.pollId,
      input.option,
      user,
    );
    await pubSub.publish(`pollResults_${input.pollId}`, {
      pollResults: result,
    });
    return true;
  }

  @Subscription(() => PollType, {
    filter: (payload, variables) => payload.pollResults.id === variables.pollId,
  })
  pollResults(@Args('pollId') pollId: string) {
    return pubSub.asyncIterator(`pollResults_${pollId}`);
  }
}
