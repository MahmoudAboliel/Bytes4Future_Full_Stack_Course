import type { Product } from "../../../lib/types.ts";
export const isLowStock = (product: Product): boolean =>
  product.deletedAt == null && product.quantity < product.minimumQuantity;

export const getLowStockProducts = (products: Product[]): Product[] =>
  products.filter(isLowStock);
