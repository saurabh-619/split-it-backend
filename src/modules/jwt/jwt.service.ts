import { JwtModuleOptions } from './interfaces/jwt-module-options.interface';
import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWT_PROVIDER_TOKEN, JwtPayload } from '@common';

@Injectable()
export class JwtService {
  constructor(
    @Inject(JWT_PROVIDER_TOKEN) private readonly options: JwtModuleOptions,
  ) {}

  sign(payload: JwtPayload) {
    return jwt.sign(payload, this.options.secretKey, { expiresIn: '15d' });
  }

  verify(token: string) {
    return jwt.verify(token, this.options.secretKey);
  }
}
