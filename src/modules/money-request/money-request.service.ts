import { User, UserService } from '@user';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  SendMoneyRequestDto,
  SendMoneyRequestOutput,
} from './dtos/send-money-request.dto';
import { Repository } from 'typeorm';
import { MoneyRequest } from './entities/money-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import {
  GetMoneyRequestsQuery,
  GetMoneyRequestsOutput,
} from './dtos/get-money-requests.dto';
import { MoneyRequestStatus } from '../common/types';
import {
  UpdateMoneyRequestDto,
  UpdateMoneyRequestOutput,
} from './dtos/update-money-request.dto';
import * as _ from 'lodash';

@Injectable()
export class MoneyRequestService {
  constructor(
    private readonly logger: PinoLogger,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(MoneyRequest)
    private readonly moneyRequestRepo: Repository<MoneyRequest>,
  ) {}

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

      await this.moneyRequestRepo.insert(moneyRequest);

      return {
        ok: true,
        status: 201,
        requestId: moneyRequest.id,
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
    const updates: Partial<UpdateMoneyRequestDto> = _.omit(
      _.pickBy(updateMoneyRequestDto, (x) => x !== undefined),
      'requestId',
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

      //TODO: need to write money transfer logic

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
