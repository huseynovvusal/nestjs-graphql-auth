import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { Repository } from 'typeorm';
import { HashingProvider } from './providers/hashing.provider';
import { Role } from 'src/enums/role.enum';
import { LoginInput } from './dto/login.input';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { AuthPayload } from './entities/auth-payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingPrivider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  async signup(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await this.hashingPrivider.hashPassword(
      createUserInput.password,
    );

    const user = this.userRepository.create({
      ...createUserInput,
      password: hashedPassword,
      role: Role.USER,
    });

    return await this.userRepository.save(user);
  }

  async login({ email, password }: LoginInput): Promise<AuthPayload> {
    const user = await this.userRepository.findOneByOrFail({ email });

    const passwordMatch = await this.hashingPrivider.comparePassword(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } =
      await this.generateTokensProvider.generateTokens(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({ id: userId });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
