import { Injectable } from '@nestjs/common';
import { CreateWalletOutput } from './dtos/create-wallet.dto';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>,
  ) {}

  async createWallet(username: string): Promise<CreateWalletOutput> {
    try {
      const walletInstance = this.walletRepo.create({
        balance: 5000.0,
      });
      const wallet = await this.walletRepo.save(walletInstance);
      return {
        ok: true,
        status: 201,
        wallet,
      };
    } catch (e) {
      return {
        ok: false,
        status: 500,
        error: `couldn't create a wallet for user ${username}`,
      };
    }
  }
}
