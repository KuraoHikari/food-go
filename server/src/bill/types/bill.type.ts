import { Order } from './order.type';

export type Bill = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  note: string;
  hasReviewed: boolean;
  orders: Order[];
};
