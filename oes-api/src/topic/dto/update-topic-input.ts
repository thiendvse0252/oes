import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateTopicInput {
  @Field({ nullable: true })
  name?: string;
}
