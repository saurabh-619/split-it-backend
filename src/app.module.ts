import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { __prod__ } from './utils/constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      ignoreEnvFile: __prod__,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: !__prod__,
      synchronize: !__prod__,
      entities: [],
    }),
    UserModule,
  ],
})
export class AppModule {}
