import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateQuestionInput {
  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  description?: string;
}
