import { pickBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, InsertResult, Repository } from 'typeorm';
import { UpdateUserDto, UpdateUserOutput } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { PinoLogger } from 'nestjs-pino';
import { CheckIfUsernameAvailableOutput } from './dtos/check-if-username-taken.dto';
import { SearchUserOuput } from './dtos/search-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    this.logger.setContext(UserService.name);
  }

  async me(): Promise<string> {
    return 'user';
  }

  async getUserById(id: number): Promise<User> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['wallet'],
    });
  }

  async getUsersByIds(ids: number[]): Promise<User[]> {
    return this.userRepo.find({
      where: { id: In(ids) },
      relations: ['wallet'],
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        username,
      },
    });
  }

  async getUserByUsernameWithWallet(username: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        username,
      },
      relations: ['wallet'],
    });
  }

  async getUserByUsernameWithWalletWithsaltAndHash(
    username: string,
  ): Promise<User> {
    return this.userRepo
      .createQueryBuilder('user')
      .select('*')
      .leftJoinAndSelect('user.wallet', 'wallet')
      .where('user.username = :username', { username })
      .getRawOne();
  }

  create(user: Partial<User>): User {
    return this.userRepo.create({
      ...user,
    });
  }

  async save(user: Partial<User>): Promise<User> {
    return this.userRepo.save({
      ...user,
    });
  }

  async insert(user: Partial<User>): Promise<InsertResult> {
    return this.userRepo.insert({
      ...user,
    });
  }

  async checkIfUsernameAvailable(
    username: string,
  ): Promise<CheckIfUsernameAvailableOutput> {
    try {
      const count = await this.userRepo.count({ where: { username } });

      return {
        ok: true,
        status: 200,
        isAvailable: count === 0,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {};
    }
  }

  async searchUser(query: string): Promise<SearchUserOuput> {
    try {
      const results = await this.userRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.wallet', 'wallet')
        .where('user.username Ilike :query', { query: `%${query}%` })
        .orWhere('user.firstName Ilike :query', { query: `%${query}%` })
        .orWhere('user.lastName Ilike :query', { query: `%${query}%` })
        .limit(7)
        .getMany();

      return {
        ok: true,
        status: 200,
        size: results.length,
        results,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't find friends",
        results: [],
      };
    }
  }

  async update(
    user: User,
    updates: Partial<UpdateUserDto>,
  ): Promise<UpdateUserOutput> {
    try {
      updates.email = updates.email === user.email ? undefined : updates.email;
      updates.username =
        updates.username === user.username ? undefined : updates.username;

      updates = pickBy(updates, (x) => x !== undefined);

      // check if user already exists
      if (updates.email) {
        const userByEmail = await this.getUserByEmail(updates.email);
        if (userByEmail !== null) {
          return {
            ok: false,
            status: 400,
            error: 'user with the given email already exists',
          };
        }
      }

      if (updates.username) {
        const userByUsername = await this.getUserByUsername(updates.username);
        if (userByUsername !== null) {
          return {
            ok: false,
            status: 400,
            error: 'user with the given username already exists',
          };
        }
      }

      await this.userRepo.update(user.id, {
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
        error: "couldn't update the user",
      };
    }
  }
}
