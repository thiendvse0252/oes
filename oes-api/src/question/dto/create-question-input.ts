import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateQuestionInput {
  @Field({ nullable: true })
  name?: string;

  @Field()
  code?: string;
}
