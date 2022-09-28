import { UserModule } from './../user/user.module';
import { WalletModule } from './../wallet/wallet.module';
import { HttpModule } from './../http/http.module';
import { AuthService } from './auth.service';
import { ValidationModule } from '../validation/validation.module';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [ValidationModule, HttpModule, WalletModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
