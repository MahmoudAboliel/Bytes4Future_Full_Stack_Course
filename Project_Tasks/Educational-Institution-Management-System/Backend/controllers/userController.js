import * as userServices from "../services/userService.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userServices.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  const uid = req.params.id;
  try {
    const users = await userServices.getUserById(uid);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNewUser = async (req, res) => {
  const userData = req.body;
  try {
    const user = await userServices.createUser(userData);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const userData = req.body;
  const uid = req.params.id;
  try {
    const user = await userServices.updateUser(uid, userData);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteUser = async (req, res) => {
  const uid = req.params.id;
  try {
    const user = await userServices.deleteUser(uid);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

