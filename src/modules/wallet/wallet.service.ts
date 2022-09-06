import { User } from '@user';
import { Injectable } from '@nestjs/common';
import { CreateWalletOutput } from './dtos/create-wallet.dto';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MyWalletOutput } from './dtos/my-wallet.dto';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class WalletService {
  constructor(
    private readonly logger: PinoLogger,
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

  async myWallet(user: User): Promise<MyWalletOutput> {
    try {
      const wallet = await this.walletRepo.findOne({
        where: {
          owner: { id: user.id },
        },
        relations: ['owner'],
      });

      return {
        ok: true,
        status: 200,
        wallet,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't find the wallet",
      };
    }
  }
}
