import { User } from './../user/entities/User.entity';
import { Controller, Get } from '@nestjs/common';
import { AuthUser } from '../auth/auth.user.decorator';
import { MyWalletOutput } from './dtos/my-wallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  myWallet(@AuthUser() user: User): Promise<MyWalletOutput> {
    return this.walletService.myWallet(user);
  }

  // @Post()
  // transferMoney(@AuthUser() user: User): Promise<TransferMoneyOutput> {
  //   return this.walletService.transferMoney(user, 7, 8, 250);
  // }
}
