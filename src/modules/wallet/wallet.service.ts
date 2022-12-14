import { User } from './../user/entities/User.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateWalletOutput } from './dtos/create-wallet.dto';
import { MyWalletOutput } from './dtos/my-wallet.dto';
import { TransferMoneyOutput } from './dtos/transfer-money.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  private readonly logger: Logger;

  constructor(
    private readonly userService: UserService,
    @InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>,
  ) {
    this.logger = new Logger(WalletService.name);
  }

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

  async save(wallet: Partial<Wallet>): Promise<Wallet> {
    return this.walletRepo.save(wallet);
  }

  async update(wallet: Partial<Wallet>): Promise<UpdateResult> {
    return this.walletRepo.update(wallet.id, wallet);
  }

  async transferMoney(
    user: User,
    fromId: number,
    toId: number,
    amount: number,
  ): Promise<TransferMoneyOutput> {
    try {
      const from = await this.userService.getUserById(fromId);

      if (from === null || from.wallet === null) {
        return {
          ok: false,
          status: 400,
          error: "couldn't find the sender or their wallet",
        };
      }

      if (user.id !== from.id) {
        return {
          ok: false,
          status: 400,
          error:
            "current user doesn't have enough authority to proceed with given request",
        };
      }

      const to = await this.userService.getUserById(toId);

      if (to === null || to.wallet === null) {
        return {
          ok: false,
          status: 400,
          error: "couldn't find the receiver or their wallet",
        };
      }

      if (from.wallet.balance < amount) {
        return {
          ok: false,
          status: 400,
          error: "you don't have enough balance in the wallet",
        };
      }

      try {
        await this.walletRepo.manager.transaction(async (maneger) => {
          // cut money from 'from' user
          await maneger.update(
            Wallet,
            {
              owner: { id: fromId },
            },
            {
              balance: from.wallet.balance - amount,
            },
          );
          // add money to 'to' user
          await maneger.update(
            Wallet,
            {
              owner: { id: toId },
            },
            {
              balance: to.wallet.balance + amount,
            },
          );
        });
      } catch (error) {
        return {
          ok: false,
          status: 400,
          error: 'transaction went wrong',
        };
      }

      return {
        ok: true,
        status: 200,
      };
    } catch (e) {
      this.logger.error(e.messsage);
      return {
        ok: false,
        status: 400,
        error: "couldn't complete the transaction",
      };
    }
  }
}
