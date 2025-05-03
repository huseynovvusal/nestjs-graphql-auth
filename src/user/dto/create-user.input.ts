import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @Field()
  username: string;

  @IsString()
  @IsEmail()
  @Field()
  email: string;

  // @IsEnum(Role)
  // @Field(() => Role)
  // role: Role;

  @IsString()
  @MinLength(6)
  @Field()
  password: string;
}
