import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateQuestionInput {
  @Field({ nullable: true })
  name?: string;

  @Field()
  code?: string;
}
