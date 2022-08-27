export enum MoneyRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted ',
  REJECTED = 'rejected',
  PAID = 'paid',
}

export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted ',
  REJECTED = 'rejected',
}

export enum TransactionType {
  BILL = 'bill',
  SPLIT = 'split',
  WALLET = 'wallet',
}

export type JwtPayload = {
  id: number;
  email: string;
  username: string;
};
