import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ValidationService {
  async generateSalt(): Promise<string> {
    return bcrypt.genSalt();
  }
  async generatePasswordHash(salt: string, password: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
  async validatePassword(
    salt: string,
    storedPasswordHash: string,
    password: string,
  ): Promise<boolean> {
    return (
      (await this.generatePasswordHash(salt, password)) === storedPasswordHash
    );
  }
}
