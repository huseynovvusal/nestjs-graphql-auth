import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { Repository } from 'typeorm';
import { HashingProvider } from './providers/hashing.provider';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingPrivider: HashingProvider,
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
}
