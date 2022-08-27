import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { __prod__ } from '../utils';
import { DataSource } from 'typeorm';

dotenv.config({
  path: '.env.development',
});
const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  logging: !__prod__,
  synchronize: false,
  entities: [__dirname + '/../modules/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
});
