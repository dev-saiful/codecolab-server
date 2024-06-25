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
  getPostsByVote,
  getPostsByComment,
  getPostsByTags,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  handleVote,
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
  getPostsByVote,
  getPostsByComment,
  getPostsByTags,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  handleVote,
  resetPassword,
  resetPasswordToken,
  changePassword,
  sendOTP,
};
