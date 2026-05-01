import { Product } from "../data/products";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Cart = Record<string, number>;

export type Order = {
  id: string;
  createdAt: string;
  items: Array<Product & { quantity: number }>;
  total: number;
};
