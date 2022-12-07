import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  firstname?: string;
  @Field({ nullable: true })
  lastname?: string;
  @Field(() => [String], { nullable: true })
  subject?: string[];
  @Field(() => [String], { nullable: true })
  examination?: string[];
  @Field(() => [String], { nullable: true })
  invigilate?: string[];
}
