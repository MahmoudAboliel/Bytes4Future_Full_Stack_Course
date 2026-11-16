import * as userServices from "../services/userServices.js";

export const getAll = async (req, res) => {
  const page = Number(req.query.page) ?? 0;
  const limit = Number(req.query.limit) ?? 0;
  const sortAge = Number(req.query.sortAge);
  const sort = {};
  if (sortAge) {
    sort.age = sortAge;
  }
  const skip = (page - 1) * limit;

  try {
    const users = await userServices.getAll(skip, limit, sort);
    const totalCount = await userServices.getCount();
    res.status(200).json({
      success: true,
      message: "fetch users successfully",
      data: users,
      metaData: {
        totalCount,
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `failed to fetch users ${error}`,
      success: false,
      data: null,
    });
  }
};

export const createOne = async (req, res) => {
  const { name, email, age } = req.body;
  try {
    if (!name || !email || !age) {
      res.status(400).json({
        message: "some data are missing",
        success: false,
        data: null,
      });
    }
    const user = await userServices.create({ name, email, age });
    res.status(201).json({
      message: "create user successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
      data: null,
    });
  }
};
