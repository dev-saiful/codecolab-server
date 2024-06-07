import {
  register,
  login,
  logout,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "./user.controller.js";
import { getPosts, createPost } from "./post.controller.js";
import {
  resetPasswordToken,
  resetPassword,
  changePassword
} from "./resetPassword.controller.js";
import {} from "";

export {
  register,
  login,
  logout,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  getPosts,
  createPost,
  resetPassword,
  resetPasswordToken,
  changePassword
};
