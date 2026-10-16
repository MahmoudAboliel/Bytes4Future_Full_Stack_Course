import {
  getData,
  postData,
  patchData,
  deleteData,
} from "../../../core/http_methods";

import { base_url, movements_url } from "../../../core/end_points";
import type { Movement, CreateMovement } from "../../../lib/types";

const movementsEndpoint = `${base_url}${movements_url}`;

export const getAllMovements = async (): Promise<Movement[]> => {
  const response = await getData(movementsEndpoint);

  const movements: Movement[] = Array.isArray(response)
    ? response
    : response.data;

  return movements;
};

export const addMovement = (data: CreateMovement) =>
  postData(movementsEndpoint, {
    ...data,
    amount: Number(data.amount),
    date: data.date,
  });
