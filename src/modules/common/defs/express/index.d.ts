import { User } from './../../../user/entities/User.entity';
export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
