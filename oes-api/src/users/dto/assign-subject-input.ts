import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class AssignSubjectInput {
  @Field(() => ID)
  subjectId: string;
}
