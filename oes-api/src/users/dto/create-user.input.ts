import { Field, InputType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
  @Field({ nullable: true })
  firstname?: string;
  @Field({ nullable: true })
  lastname?: string;
  @Field({ defaultValue: 'STUDENT' })
  role: Role;
  // @Field(() => [String], { nullable: true })
  // examination?: string[];
  // @Field(() => [String], { nullable: true })
  // invigilate?: string[];
}
