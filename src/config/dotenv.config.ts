import { ConfigModuleOptions } from '@nestjs/config';
import { __prod__ } from '@utils';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '.env.development',
  ignoreEnvFile: __prod__,
};
