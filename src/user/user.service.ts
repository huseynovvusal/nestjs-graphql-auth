import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneByOrFail({ id });
  }

  async create(createUserInput: CreateUserInput) {
    const newUser = this.userRepository.create(createUserInput);

    return await this.userRepository.save(newUser);
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const user = await this.userRepository.findOneByOrFail({ id });

    return await this.userRepository.save(
      new User(Object.assign(user, updateUserInput)),
    );
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);

    return result.affected === 1;
  }
}
