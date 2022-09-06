import { User } from '@user';
import { AuthUser } from '@auth-user';
import { Controller, Get } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { MyWalletOutput } from './dtos/my-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  myWallet(@AuthUser() user: User): Promise<MyWalletOutput> {
    return this.walletService.myWallet(user);
  }
}
