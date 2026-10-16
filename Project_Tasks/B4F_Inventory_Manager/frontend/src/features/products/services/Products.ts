import {
  getData,
  postData,
  patchData,
  deleteData,
} from "../../../core/http_methods";
import { base_url, products_url } from "../../../core/end_points";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "../../../lib/types";

const productsEndpoint = `${base_url}${products_url}`;

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await getData(productsEndpoint);
  const products: Product[] = Array.isArray(response)
    ? response
    : response.data;

  return products.filter((product) => product.deletedAt == null);
};

export const getProductById = async (
  id: string,
): Promise<Product | undefined> => {
  const product: Product = await getData(`${productsEndpoint}/${id}`);
  return product.deletedAt == null ? product : undefined;
};

export const addProduct = async (
  data: CreateProductInput,
): Promise<Product> => {
  const name = data.name.trim();

  if (!name) throw new Error("Product name is required.");
  if (!Number.isFinite(data.minimumQuantity) || data.minimumQuantity < 0) {
    throw new Error("Minimum quantity must be zero or greater.");
  }

  const now = new Date().toISOString();

  return postData(productsEndpoint, {
    name,
    quantity: 0,
    minimumQuantity: Number(data.minimumQuantity),
    imageUrl: data.imageUrl?.trim() || "",
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  });
};

export const updateProduct = async (id: string, data: UpdateProductInput) => {
  const name = data.name.trim();

  if (!name) throw new Error("Product name is required.");
  if (!Number.isFinite(data.minimumQuantity) || data.minimumQuantity < 0) {
    throw new Error("Minimum quantity must be zero or greater.");
  }

  return patchData(`${productsEndpoint}/${id}`, {
    name,
    minimumQuantity: Number(data.minimumQuantity),
    imageUrl: data.imageUrl?.trim() || "",
    updatedAt: new Date().toISOString(),
  });
};

export const deleteProduct = (id: string) =>
  deleteData(`${productsEndpoint}/${id}`);

export const updateProductQuantity = (id: string, quantity: number) => {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("Stock quantity must be a non-negative integer.");
  }

  return patchData(`${productsEndpoint}/${id}`, {
    quantity,
    updatedAt: new Date().toISOString(),
  });
};
