import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { AuthService } from './auth.service';
import { AuthPayload } from './entities/auth-payload';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async signup(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.authService.signup(createUserInput);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }
}
