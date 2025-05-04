import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { Repository } from 'typeorm';
import { HashingProvider } from './providers/hashing.provider';
import { Role } from 'src/enums/role.enum';
import { LoginInput } from './dto/login.input';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingPrivider: HashingProvider,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
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

  async login({ email, password }: LoginInput) {
    const user = await this.userRepository.findOneByOrFail({ email });

    const passwordMatch = await this.hashingPrivider.comparePassword(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  /*   private async generateToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
      expiresIn: this.jwtConfiguration.accessTokenTtl,
    });

    return accessToken;
  } */
}
