import MovementModel from "../models/MovementModel.js";
import Product from "../models/ProductModel.js";

export const getAllMovements = async (req, res) => {
  try {
    const {
      _sort = "createdAt",
      _order = "DESC",
      _start = 0,
      _end = 100,
      type,
      productName,
    } = req.query;

    const start = Number(_start);
    const end = Number(_end);
    const limit = end - start;

    const sortField = _sort === "id" ? "_id" : _sort;
    const sortOrder = _order.toUpperCase() === "DESC" ? -1 : 1;

    const movementQuery = {};
    if (type) {
      movementQuery.type = type;
    }

    if (productName) {
      const matchingProducts = await Product.find({
        name: new RegExp(productName, "i"),
      }).select("_id");

      const productIds = matchingProducts.map((p) => p._id);
      movementQuery.productId = { $in: productIds };
    }

    const movements = await MovementModel.findAll(
      movementQuery,
      sortField,
      sortOrder,
    );
    const total = movements.length;

    const selectedMovements = movements.slice(start, start + limit);

    const rangeEnd =
      selectedMovements.length > 0
        ? start + selectedMovements.length - 1
        : start;

    res.set("Content-Range", `movements ${start}-${rangeEnd}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    res.status(200).json(selectedMovements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMovementById = async (req, res) => {
  try {
    const movement = await MovementModel.findById(req.params.id);
    if (!movement) return res.status(404).json({ message: "Not found" });
    res.status(200).json(movement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMovement = async (req, res) => {
  try {
    const movement = await MovementModel.create(req.body);
    if (movement) {
      res.status(201).json(movement);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// export const updateMovement = async (req, res) => {
//   try {
//     const movement = await MovementModel.update(req.params.id, req.body);
//     if (!movement) return res.status(404).json({ message: 'Not found' });
//     res.status(200).json(movement);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// export const deleteMovement = async (req, res) => {
//   try {
//     const movement = await MovementModel.delete(req.params.id);
//     if (!movement) return res.status(404).json({ message: 'Not found' });
//     res.status(200).json({ message: 'Deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
