// user.controller.js placeholder

import {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../services/user.service.js";
export const getUserByIdController = async (req, res, next) => {
  try {
    const userId = req.params._id;
    const user = await getUserById(userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
export const updateUserController = async (req, res, next) => {
  try {
    const userId = req.params._id;
    const userData = req.body;
    const user = await updateUser(userId, userData);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteUserController = async (req, res, next) => {
  try {
    const userId = req.params._id;
    await deleteUser(userId);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};  

