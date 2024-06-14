import {
  register,
  login,
  logout,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  sendOTP,
} from "./user.controller.js";
import { getPosts, createPost } from "./post.controller.js";
import {
  resetPasswordToken,
  resetPassword,
  changePassword
} from "./resetPassword.controller.js";


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
  changePassword,
  sendOTP
};
