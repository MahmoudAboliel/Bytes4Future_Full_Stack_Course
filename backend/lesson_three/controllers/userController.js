import User from "../models/userModel.js";

export const getAllController = (req, res) => {
  const { _sort, _order, _start, _end } = req.query;
  const result = [...User.find()];
  if (_sort && _order) {
    result.sort((a, b) => {
      if (a[_sort] < b[_sort]) return _order === "ASC" ? -1 : 1;
      if (a[_sort] > b[_sort]) return _order === "ASC" ? 1 : -1;
      return 0;
    });
  }
  const start = _start ? parseInt(_start) : 0;
  const end = _end ? parseInt(_start) : result.length;

  const paginated = result.slice(start, end);
  res.setHeader("Content-Range", `user ${start}-${end - 1}/${result.length}`);
  res.setHeader("Access-Control-Expose-Headers", "Content-Range");

  res.json(paginated);
  //   res.json({
  //     data: users,
  //     message: users ? "Successfully" : "Error",
  //     status: users ? 200 : 400,
  //   });
};

export const getByIdController = (req, res) => {
  const userId = Number(req.params.id);
  const user = User.getById(userId);

  res.json({
    data: user,
    message: user ? "Successfully" : "Not found",
    status: user ? 200 : 404,
  });
};

export const createController = async (req, res) => {
  const { name, family, age } = req.body;
  if (name && family && age) {
    const user = await User.insertOne({ name, family, age })
    console.log(user);
    res.json({
      data: user,
      message: user ? "Successfully" : "Error",
      status: user ? 201 : 400,
    });
  } else {
    res.json({
      message: "Bad request",
      status: 400,
    });
  }
};

export const updateController = (req, res) => {
  const userId = Number(req.params.id);
  const temp = req.body;

//   const user = User.findOneAndUpdate({ });
  if (user) {
    res.json({
      data: user,
      message: "Successfully",
      status: 200,
    });
  } else {
    res.json({
      message: "Not found",
      status: 404,
    });
  }
};

export const deleteController = (req, res) => {
  const userId = Number(req.params.id);
  const user = User.delete(userId);
  if (user) {
    res.json({
      data: user,
      message: "Successfully",
      status: 200,
    });
  } else {
    res.json({
      message: "Not found",
      status: 404,
    });
  }
};
