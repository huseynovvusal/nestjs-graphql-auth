import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(data.toString(), salt);
  }

  public async comparePassword(
    data: string | Buffer,
    encrypted: string | Buffer,
  ): Promise<boolean> {
    return bcrypt.compare(data.toString(), encrypted.toString());
  }
}
