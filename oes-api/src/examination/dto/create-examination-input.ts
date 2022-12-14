import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateExaminationInput {
  @Field({ nullable: true })
  name?: string;

  @Field()
  code: Boolean;
}
