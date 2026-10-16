import MovementModel from "../models/MovementModel.js";
import Product from "../models/ProductModel.js";

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const daysAgo = (n) => {
  const d = startOfDay();
  d.setDate(d.getDate() - n);
  return d;
};

// 1
export const getDashboardStats = async (req, res) => {
  const sevenDaysAgo = daysAgo(6);

  const productStats = await Product.aggregate([
    { $match: { deletedAt: null } },
    {
      $facet: {
        total: [{ $count: "count" }],
        totalStock: [{ $group: { _id: null, sum: { $sum: "$quantity" } } }],
        lowStock: [
          { $match: { $expr: { $lte: ["$quantity", "$minimumQuantity"] } } },
          { $count: "count" },
        ],
      },
    },
  ]);

  const movementStats = await MovementModel.stats(sevenDaysAgo);

  const inAgg = movementStats.find((m) => m._id === "in") || {
    total: 0,
    count: 0,
  };
  const outAgg = movementStats.find((m) => m._id === "out") || {
    total: 0,
    count: 0,
  };

  const productsCount = productStats[0]?.total?.[0]?.count ?? 0;
  const totalStock = productStats[0]?.totalStock?.[0]?.sum ?? 0;
  const lowStockCount = productStats[0]?.lowStock?.[0]?.count ?? 0;

  return {
    productsCount,
    totalStock,
    lowStockCount,
    totalIn: inAgg.total,
    totalOut: outAgg.total,
    movementsCount: inAgg.count + outAgg.count,
    net: inAgg.total - outAgg.total,
  };
};

// 2
export const getWeeklyTrend = async () => {
  const sevenDaysAgo = daysAgo(6);

  const result = await MovementModel.weeklyTrend(sevenDaysAgo);

  // Build a 7-day skeleton so missing days show as 0
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = daysAgo(i);
    const key = d.toISOString().slice(0, 10);
    const inDoc = result.find((r) => r._id.day === key && r._id.type === "in");
    const outDoc = result.find(
      (r) => r._id.day === key && r._id.type === "out",
    );

    days.push({
      date: key,
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      Inbound: inDoc?.total ?? 0,
      Outbound: outDoc?.total ?? 0,
      Net: (inDoc?.total ?? 0) - (outDoc?.total ?? 0),
    });
  }

  return days;
};

// 3
export const getInboundOutboundRatio = async (from, to) => {
  const match = {};
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = new Date(from);
    if (to) match.date.$lte = new Date(to);
  }

  const result = await MovementModel.inOutboundRatio(match);

  const inTotal = result.find((r) => r._id === "in")?.total ?? 0;
  const outTotal = result.find((r) => r._id === "out")?.total ?? 0;

  return [
    { name: "Inbound", value: inTotal },
    { name: "Outbound", value: outTotal },
  ];
};

// 4
export const getTopMovingProducts = async (limit = 5) => {
  return MovementModel.topMoving(limit);
};

// 5
export const getRecentMovements = async (limit = 6) => {
  return MovementModel.recentMovements(limit);
};

// 6
export const getLowStockProducts = async () => {
  return Product.find({
    deletedAt: null,
    $expr: { $lte: ["$quantity", "$minimumQuantity"] },
  })
    .sort({ quantity: 1 })
    .select("name quantity minimumQuantity imageUrl updatedAt")
    .lean();
};

// 7
export const getFullDashboard = async () => {
  const [stats, trend, ratio, topProducts, recent, lowStock] =
    await Promise.all([
      getDashboardStats(),
      getWeeklyTrend(),
      getInboundOutboundRatio(),
      getTopMovingProducts(5),
      getRecentMovements(6),
      getLowStockProducts(),
    ]);
  return { stats, trend, ratio, topProducts, recent, lowStock };
};