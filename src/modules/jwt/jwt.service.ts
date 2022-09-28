import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWT_PROVIDER_TOKEN } from '../common/constants';
import { JwtPayload } from './../common/types';
import { JwtModuleOptions } from './interfaces/jwt-module-options.interface';

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
