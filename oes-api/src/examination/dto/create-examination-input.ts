import { Field, InputType } from '@nestjs/graphql';
import { ExaminationStatus} from '@prisma/client';

@InputType()
export class CreateExaminationInput {
  @Field({ nullable: true })
  id?: string;

  @Field()
  startAt?: Date;

  @Field()
  status?: ExaminationStatus;

  @Field()
  isEnabled?: boolean;
}
