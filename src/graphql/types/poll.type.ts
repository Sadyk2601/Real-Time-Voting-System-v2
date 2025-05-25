import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PollType {
  @Field(() => ID)
  id: string;

  @Field()
  question: string;

  @Field(() => [String])
  options: string[];

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;
}
