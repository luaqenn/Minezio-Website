import { Product } from "./product";

export type ChestItem = {
  id: string;
  product: Product;
  used: boolean;
  createdAt: string;
  updatedAt: string;
};
