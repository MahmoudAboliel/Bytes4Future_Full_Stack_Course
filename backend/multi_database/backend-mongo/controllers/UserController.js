import User from "../models/UserModel.js";

export const getUsersController = async (req, res) => {
  const { _sort, _order, _start, _end } = req.query;
  let result = await User.find();
  if (_sort && _order) {
    result.sort((a, b) => {
      if (a[_sort] < b[_sort]) return _order === "ASC" ? -1 : 1;
      if (a[_sort] > b[_sort]) return _order === "ASC" ? 1 : -1;
      return 0;
    });
  }
  const start = _start ? parseInt(_start) : 0;
  const end = _end ? parseInt(_end) : result.length;
  const paginated = result.slice(start, end);
  res.setHeader("Content-Range", `user ${start}-${end - 1}/${result.length}`);
  res.setHeader("Access-Control-Expose-Headers", "Content-Range");
  res.json(paginated);
  // res.json(User.findAll());
};

export const findUserByIdController = (req, res) => {
  const id = req.params.id;
  res.json(User.findById(id));
};

export const createNewUserController = async (req, res) => {
  const temp = req.body;
  const user = await User.create(temp);
  res.json(user);
};
export const updateUserController = async (req, res) => {
  // const user = User.update(req.params.id, req.body);
  const user = await User.findByIdAndUpdate(req.params.id, req.body);
  if (!user) return res.json({ error: "User not found" });
  res.json(user);
};

export const deletUserController = (req, res) => {
  const user = User.delete(req.params.id);
  if (!user) return res.json({ error: "User not found" });
  res.json({ message: "User deleted", user });
};
