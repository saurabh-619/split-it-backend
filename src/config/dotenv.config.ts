import { __prod__ } from './../utils/constant';
import { ConfigModuleOptions } from '@nestjs/config';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '.env.development',
  ignoreEnvFile: __prod__,
};
