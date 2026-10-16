export interface DashboardStats {
  productsCount: number;
  totalStock: number;
  lowStockCount: number;
  totalIn: number;
  totalOut: number;
  movementsCount: number;
  net: number;
}

export interface TrendPoint {
  date: string; // "YYYY-MM-DD"
  day: string; // "Mon", "Tue", ...
  Inbound: number;
  Outbound: number;
  Net: number;
}

export interface RatioPoint {
  name: "Inbound" | "Outbound";
  value: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  shortName: string;
  Inbound: number;
  Outbound: number;
  total: number;
}

export interface RecentMovementProduct {
  _id: string;
  name: string;
  imageUrl?: string;
}

export interface RecentMovement {
  _id: string;
  type: "in" | "out";
  amount: number;
  date: string; // ISO string
  note?: string;
  productId: RecentMovementProduct;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  quantity: number;
  minimumQuantity: number;
  imageUrl?: string;
  updatedAt: string;
}

/* ---------- Full dashboard payload ---------- */

export interface DashboardData {
  stats: DashboardStats;
  trend: TrendPoint[];
  ratio: RatioPoint[];
  topProducts: TopProduct[];
  recent: RecentMovement[];
  lowStock: LowStockProduct[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
