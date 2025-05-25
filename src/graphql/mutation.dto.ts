import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class VoteInput {
  @Field(() => ID)
  @IsNotEmpty()
  pollId: string;

  @Field()
  @IsNotEmpty()
  option: string;
}
