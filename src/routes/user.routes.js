import { Router } from "express";
import {
  login,
  logout,
  register,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  sendOTP,
  resetPassword,
  resetPasswordToken,
  changePassword,
} from "../controllers/index.js";
import { auth, isAdmin, isUser } from "../middlewares/auth.middleware.js";

const userRoute = Router();

/**
 * @desc Send OTP
 * @method POST
 * @route http://localhost:{PORT}/api/v1/user/send-otp
 * @params
 * @access public
 */
userRoute.post("/send-otp", sendOTP);

/**
 * @desc Login User
 * @method POST
 * @route http://localhost:{PORT}/api/v1/user/login
 * @params
 * @access public
 */
userRoute.post("/login", login);

/**
 * @desc Register User
 * @method POST
 * @route http://localhost:{PORT}/api/v1/user/register
 * @params
 * @access public
 */
userRoute.post("/register", register);

/**
 * @desc User Logout
 * @method POST
 * @route http://localhost:{PORT}/api/v1/user/logout
 * @access private
 */
userRoute.post("/logout", logout);

/**
 * @desc Reset password token
 * @method POST
 * @route http://localhost:{PORT}/api/v1/user/reset-password-token
 * @access public
 */
userRoute.post("/reset-password-token", resetPasswordToken);

/**
 * @desc Reset password
 * @method POST
 * @route http://localhost:{PORT}/api/v1/user/reset-password
 * @access public
 */
userRoute.post("/reset-password", resetPassword);

/**
 * @desc Reset password
 * @method POST
 * @route http://localhost:{PORT}/api/v1/user/reset-password
 * @access public
 */
userRoute.put("/change-password", auth, isUser, changePassword);

/**
 * @desc Get all user
 * @method GET
 * @route http://localhost:{PORT}/api/v1/user/
 * @access private
 */
userRoute.get("/", auth, isAdmin, getUsers);

/**
 * @desc Get user by id
 * @method GET
 * @route http://localhost:{PORT}/api/v1/user/:id
 * @access private
 */
userRoute.get("/:id", auth, isUser, getUserById);
userRoute.get("/:id", auth, isAdmin, getUserById);

/**
 * @desc Update user by id
 * @method PUT
 * @route http://localhost:{PORT}/api/v1/user/:id
 * @access private
 */
userRoute.put("/:id", auth, isUser, updateUser);
userRoute.put("/:id", auth, isAdmin, updateUser);

/**
 * @desc Delete user by id
 * @method DELETE
 * @route http://localhost:{PORT}/api/v1/user/:id
 * @access private
 */
userRoute.delete("/:id", auth, isUser, deleteUser);
userRoute.delete("/:id", auth, isAdmin, deleteUser);

export default userRoute;
