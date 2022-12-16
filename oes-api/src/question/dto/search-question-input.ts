import { Field, InputType } from '@nestjs/graphql';
import { SearchInput } from 'src/common/models/search-input.model';

@InputType()
export class SearchQuestionInput extends SearchInput {
  @Field({ defaultValue: 'name', nullable: true })
  keyword?: 'name' | 'code';
}
