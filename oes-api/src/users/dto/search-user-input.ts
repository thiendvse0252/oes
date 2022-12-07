import { Field, InputType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { SearchInput } from 'src/common/models/search-input.model';

@InputType()
export class SearchUserInput extends SearchInput {
  @Field({ nullable: true })
  role?: Role;
  @Field(() => [String], { nullable: true })
  subject?: string[];
  @Field(() => [String], { nullable: true })
  examination?: string[];
}
