import mongoose from "mongoose";
import Product from "./ProductModel.js";
const movementSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: {
        values: ["in", "out"],
        message: "The Type Of Process must is out or in",
      },
    },
    note: { type: String, required: false },
    amount: { type: Number, required: true },
    date: { type: Date, default: new Date(), required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    id: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // },
);
movementSchema.index({ date: -1 });
movementSchema.index({ type: 1 });
movementSchema.index({ productId: 1 });
// movementSchema.pre("findOneAndUpdate", function (next) {
//   this.set({ updateAt: Date.now() });
//   next();
// });
const Movement = mongoose.model("Movement", movementSchema);

class MovementModel {
  findWithPagination = async (skip, limit, sortBy, order) => {
    const movements = await Movement.find({})
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    const total = await Movement.countDocuments();
    return { movements, total };
  };

  findAll = async (movementQuery, sortField, sortOrder) => {
    return await Movement.find(movementQuery)
      .populate("productId", "name")
      .sort({ [sortField]: sortOrder });
  };

  findById = async (id) => {
    return await Movement.findById(id);
  };

  create = async (obj) => {
    const { productId, amount, type } = obj;
    console.log("welcome");
    const product = await Product.updateStock(productId, type, amount);
    console.log("product model");
    console.log(product);
    if (product) {
      const movement = new Movement(obj);
      const savedMovement = await movement.save();
      console.log(savedMovement);
      return savedMovement;
    } else {
      throw new Error("Product not found or stock update failed");
    }
  };

  update = async (id, obj) => {
    return await Movement.findByIdAndUpdate(id, obj, {
      new: true,
      runValidators: true,
    });
  };
  delete = async (id) => {
    return await Movement.findByIdAndDelete(id);
  };

  stats = async (sevenDaysAgo) => {
    return await Movement.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);
  };

  weeklyTrend = async (sevenDaysAgo) => {
    return await Movement.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
    ]);
  };

  inOutboundRatio = async (match) => {
    return await Movement.aggregate([
      ...(Object.keys(match).length ? [{ $match: match }] : []),
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);
  };

  topMoving = async (limit = 5) => {
    return await Movement.aggregate([
      {
        $group: {
          _id: "$productId",
          Inbound: {
            $sum: { $cond: [{ $eq: ["$type", "in"] }, "$amount", 0] },
          },
          Outbound: {
            $sum: { $cond: [{ $eq: ["$type", "out"] }, "$amount", 0] },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products", // <-- your actual collection name (usually pluralized)
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$product.name",
          Inbound: 1,
          Outbound: 1,
          total: 1,
          shortName: {
            $cond: [
              { $gt: [{ $strLenCP: "$product.name" }, 16] },
              { $concat: [{ $substrCP: ["$product.name", 0, 16] }, "…"] },
              "$product.name",
            ],
          },
        },
      },
    ]);
  };

  recentMovements = async (limit = 6) => {
    return await Movement.find()
      .sort({ date: -1 })
      .limit(limit)
      .populate("productId", "name imageUrl")
      .lean();
  };
}

export default new MovementModel();
