import { JwtService } from '@jwt';
import { UserService } from '@user';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: PinoLogger,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers.authorization === undefined) {
        throw new Error('authorization token not provided');
      }
      const tokenString = req.headers.authorization;
      const token = tokenString.split(' ')[1];

      if (!tokenString.includes('Bearer ')) {
        throw new Error('bearer token provided');
      }

      const payload = this.jwtService.verify(token) as { id: number };
      const user = await this.userService.getUserById(payload.id);

      req.user = user;
      next();
    } catch (e) {
      this.logger.error(e.toString());
      return res.status(401).json({
        ok: false,
        status: 403,
        error: 'not authenticated, please sign in',
      });
    }
  }
}
