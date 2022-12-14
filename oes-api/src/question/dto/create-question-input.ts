import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateQuestionInput {
  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  description?: string;
}
