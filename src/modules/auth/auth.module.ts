import { WalletModule } from '@wallet';
import { HttpModule } from '@http';
import { UserModule } from '@user';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationModule } from '../validation/validation.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [ValidationModule, HttpModule, WalletModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
