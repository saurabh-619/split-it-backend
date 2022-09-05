export enum MoneyRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted ',
  REJECTED = 'rejected',
  PAID = 'paid',
}

export enum FriendRequestStatus {
  SEEN = 'seen',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  UNFRIENDED = 'unfriended',
}

export enum TransactionType {
  BILL = 'bill',
  SPLIT = 'split',
  WALLET = 'wallet',
}

export enum TransactionStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

export type JwtPayload = {
  id: number;
  email: string;
  username: string;
};
