import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RefreshTokenInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
