export interface Product {
  id: string;
  name: string;
  quantity: number;
  minimumQuantity: number;
  imageUrl: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;
}

export interface Movement {
  id: string;
  productId: {
    id: string;
    name: string;
  };
  type: "in" | "out";
  amount: number;
  date: string | Date;
  note?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type CreateProductInput = {
  name: string;
  minimumQuantity: number;
  imageUrl?: string;
};

export type UpdateProductInput = {
  name: string;
  minimumQuantity: number;
  imageUrl?: string;
};

export interface CreateMovement {
  productId: string;
  type: "in" | "out";
  amount: number;
  date: string;
  note?: string;
}
