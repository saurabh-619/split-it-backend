import { JwtModuleOptions } from '@jwt';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env.development',
});

export const jwtOptions: JwtModuleOptions = {
  secretKey: process.env.JWT_SECRET_KEY,
};
