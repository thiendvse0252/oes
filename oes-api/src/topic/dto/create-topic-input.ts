import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTopicInput {
  @Field({ nullable: true })
  name?: string;

  @Field()
  code: string;
}
