import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PollService } from '../../poll/poll.service';
import { PollType } from '../types/poll.type';
import { VoteInput } from '../mutation.dto';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/user.entity';
import { PubSub } from 'graphql-subscriptions';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

const pubSub: any = new PubSub();

@Resolver(() => PollType)
export class PollResolver {
  constructor(private pollService: PollService) {}

  @Query(() => [PollType])
  async polls() {
    console.log('adgsdhfhgdsa', this.pollService.getActivePolls());

    return this.pollService.getActivePolls();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async vote(
    @Args('input') input: VoteInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    // Вызываем сервис, чтобы зарегистрировать голос
    const result = await this.pollService.vote(
      input.pollId,
      input.option,
      user,
    );
    console.log(User);

    // Публикуем обновлённые результаты для подписчиков
    await pubSub.publish(`pollResults_${input.pollId}`, {
      pollResults: result,
    });

    // Возвращаем true, что операция прошла успешно
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Subscription(() => PollType, {
    filter: (payload, variables) => payload.pollResults.id === variables.pollId,
  })
  pollResults(@Args('pollId') pollId: string) {
    return pubSub.asyncIterator(`pollResults_${pollId}`);
  }
}
