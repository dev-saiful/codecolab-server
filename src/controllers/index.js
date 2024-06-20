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

import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  createVote,
  updateVote,
  deleteVote,
} from "./post.controller.js";

import {
  resetPasswordToken,
  resetPassword,
  changePassword,
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
  getPostById,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  createVote,
  updateVote,
  deleteVote,
  resetPassword,
  resetPasswordToken,
  changePassword,
  sendOTP,
};
