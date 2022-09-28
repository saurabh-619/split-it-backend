import { User } from './../user/entities/User.entity';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { MoneyRequestStatus, TransactionType } from '../common/types';
import { TransactionService } from './../transaction/transaction.service';
import { UserService } from './../user/user.service';
import { WalletService } from './../wallet/wallet.service';
import { GetMoneyRequestsBetweenTwoUsersOuput } from './dtos/get-money-requests-between-two-users.dto';
import {
  GetMoneyRequestsOutput,
  GetMoneyRequestsQuery,
} from './dtos/get-money-requests.dto';
import {
  SendMoneyRequestDto,
  SendMoneyRequestOutput,
} from './dtos/send-money-request.dto';
import {
  UpdateMoneyRequestDto,
  UpdateMoneyRequestOutput,
} from './dtos/update-money-request.dto';
import { MoneyRequest } from './entities/money-request.entity';

@Injectable()
export class MoneyRequestService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(MoneyRequest)
    private readonly moneyRequestRepo: Repository<MoneyRequest>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
  ) {
    this.logger = new Logger(MoneyRequestService.name);
  }

  async getById(id: number): Promise<MoneyRequest> {
    return this.moneyRequestRepo.findOne({
      where: {
        id,
      },
      relations: ['requestee', 'requester'],
    });
  }

  create(moneyRequest: Partial<MoneyRequest>): MoneyRequest {
    return this.moneyRequestRepo.create(moneyRequest);
  }

  // money requested by other people to me
  // authuser = requestee
  async getMoneyRequests(
    user: User,
    { status = MoneyRequestStatus.PENDING }: GetMoneyRequestsQuery,
  ): Promise<GetMoneyRequestsOutput> {
    try {
      const moneyRequests = await this.moneyRequestRepo.find({
        where: {
          requestee: { id: user.id },
          status,
        },
        relations: ['requestee', 'requester'],
      });

      return {
        ok: true,
        status: 200,
        size: moneyRequests.length,
        moneyRequests,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't find the money requests",
      };
    }
  }

  // money requested by me to other people
  // authuser = requester
  async getMoneyRequestsMade(
    user: User,
    { status = MoneyRequestStatus.PENDING }: GetMoneyRequestsQuery,
  ): Promise<GetMoneyRequestsOutput> {
    try {
      const moneyRequests = await this.moneyRequestRepo.find({
        where: {
          requester: { id: user.id },
          status,
        },
        relations: ['requestee', 'requester'],
      });

      return {
        ok: true,
        status: 200,
        size: moneyRequests.length,
        moneyRequests,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't find the money requests made to other users",
      };
    }
  }

  async getMoneyRequestsBetweenTwoUser(
    userId1: number,
    userId2: number,
  ): Promise<GetMoneyRequestsBetweenTwoUsersOuput> {
    try {
      const moneyRequests = await this.moneyRequestRepo
        .createQueryBuilder('money_request')
        .leftJoinAndSelect('money_request.requester', 'requester')
        .leftJoinAndSelect('money_request.requestee', 'requestee')
        .where('requester.id = :userId1', { userId1 })
        .andWhere('requestee.id = :userId2', { userId2 })
        .orWhere('requester.id = :userId2', { userId2 })
        .andWhere('requestee.id = :userId1', { userId1 })
        .getMany();

      return {
        ok: true,
        status: 200,
        moneyRequests,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: true,
        status: 500,
        error: "couldn't get money requests between two users",
      };
    }
  }

  async sendMoneyRequest(
    user: User,
    { title, description, amount, requesteeId }: SendMoneyRequestDto,
  ): Promise<SendMoneyRequestOutput> {
    try {
      if (requesteeId === user.id) {
        return {
          ok: false,
          status: 400,
          error: "request rejected. can't ask yourself money",
        };
      }

      const requestee = await this.userService.getUserById(requesteeId);

      if (requestee === null) {
        return {
          ok: false,
          status: 400,
          error: "request rejected. couldn't find the requestee",
        };
      }

      const moneyRequest = this.create({
        title,
        description,
        amount,
        requestee,
        requester: user,
      });

      const savedMoneyRequest = await this.moneyRequestRepo.save(moneyRequest);

      const savedTransaction = await this.transactionService.save({
        amount,
        type: TransactionType.WALLET,
        from: requestee,
        to: user,
        moneyRequest: savedMoneyRequest,
      });

      return {
        ok: true,
        status: 201,
        requestId: moneyRequest.id,
        transactionId: savedTransaction.id,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't send the money request",
      };
    }
  }

  async updateMoneyRequest(
    user: User,
    updateMoneyRequestDto: Partial<UpdateMoneyRequestDto>,
  ): Promise<UpdateMoneyRequestOutput> {
    const requestId = updateMoneyRequestDto.requestId;
    const transactionId = updateMoneyRequestDto.transactionId;

    const updates: Partial<UpdateMoneyRequestDto> = _.omit(
      _.pickBy(updateMoneyRequestDto, (x) => x !== undefined),
      'requestId',
      'transactionId',
    );

    try {
      const moneyRequest = await this.getById(requestId);

      if (moneyRequest === null) {
        return {
          ok: false,
          status: 400,
          error: "request doesn't exists anymore. make a new one",
        };
      }

      const transaction = await this.transactionService.getByIdWithRelations(
        transactionId,
      );

      if (transaction === null) {
        return {
          ok: false,
          status: 400,
          error: "transaction doesn't exists anymore. make a new one",
        };
      }

      if (
        // title, description and amount can be changed by requester only
        (['title', 'description', 'amount'].some((prop) =>
          updates.hasOwnProperty(prop),
        ) &&
          user.id !== moneyRequest.requester.id) ||
        // status can be changed by requstee only
        (updates.hasOwnProperty('status') &&
          user.id !== moneyRequest.requestee.id)
      ) {
        return {
          ok: false,
          status: 400,
          error: 'current user not allowed to proceed with the request',
        };
      }

      // check status validtity
      if (
        (updates.status &&
          // 1. if money is already PAID | REJECTED, we cant change it to anything
          [MoneyRequestStatus.PAID, MoneyRequestStatus.REJECTED].includes(
            moneyRequest.status,
          )) ||
        // 2. if money request is seen, it cant be pending again
        (moneyRequest.status === MoneyRequestStatus.SEEN &&
          updates.status === MoneyRequestStatus.PENDING)
      ) {
        return {
          ok: false,
          status: 400,
          error: 'invalid status of money request',
        };
      }

      //transfer money if updates.status === 'paid'
      if (updates.status && updates.status === MoneyRequestStatus.PAID) {
        const { ok, error: transferError } =
          await this.walletService.transferMoney(
            user,
            moneyRequest.requesteeId,
            moneyRequest.requesterId,
            moneyRequest.amount,
          );

        if (!ok) {
          return { ok, status: 500, error: transferError };
        }

        transaction.isComplete = true;
        await this.transactionService.save(transaction);
      }

      await this.moneyRequestRepo.update(moneyRequest.id, {
        ...updates,
      });

      return {
        ok: true,
        status: 201,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't update the money request",
      };
    }
  }
}
