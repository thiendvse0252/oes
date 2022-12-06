
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSubjectInput {
  @Field({ nullable: true })
  name?: string;
}
