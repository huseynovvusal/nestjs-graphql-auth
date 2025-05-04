import {
  Resolver,
  Query,
  ResolveField,
  Parent,
  Args,
  Int,
  Mutation,
} from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { Logger, UseGuards } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlJwtGuard } from 'src/auth/guards/gql-jwt/gql-jwt.guard';
import { CurrentUserDecorator } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);

  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Query(() => User)
  async getUser(@Args('id', { type: () => Int }) id: number) {
    return await this.userService.findOne(id);
  }

  @ResolveField('profile')
  async profile(@Parent() user: User) {
    this.logger.debug(`Fetching profile for user with ID: ${user.id}`);

    return await user.profile;
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUserDecorator() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    this.logger.debug(`Updating user with ID: ${user.id}`);

    return await this.userService.update(user.id, updateUserInput);
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    return await this.userService.remove(id);
  }
}
