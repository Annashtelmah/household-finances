import type { CategoryType } from "./categoty.type";

export type RequestOperationType = {
  type: CategoryType;
  amount: number;
  date: string;
  comment: string;
  category_id: number;
};

export type ResponseOperationType = {
  id: number;
  type: CategoryType;
  amount: number;
  date: string;
  comment: string;
  category: string;
};
