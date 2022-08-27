import { DynamicModule, Module } from '@nestjs/common';
import { JWT_PROVIDER_TOKEN } from '../common/constants';
import { JwtModuleOptions } from './interfaces/jwt-module-options.interface';
import { JwtService } from './jwt.service';

@Module({})
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        {
          provide: JWT_PROVIDER_TOKEN,
          useValue: options,
        },
        JwtService,
      ],
      exports: [JwtService],
      global: true,
    };
  }
}
