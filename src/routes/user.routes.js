import { Router } from "express";
import {
  admin,
  customer,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { auth, isAdmin, isUser } from "../middlewares/auth.middleware.js";

const userRoute = Router();
/**
 * @desc Login User
 * @method POST
 * @route http://localhost:{PORT}/api/v1/user/login
 * @params name,email,password,role
 * @access public
 */
userRoute.post("/login", login);
/**
 * @desc Register User
 * @method POST
 * @route http://localhost:{PORT}/api/v1/user/register
 * @params name,email,password,role
 * @access public
 */
userRoute.post("/register", register);
/**
 * @desc Admin Profile
 * @method GET
 * @route http://localhost:{PORT}/api/v1/user/admin
 * @access private
 */
userRoute.get("/admin", auth, isAdmin, admin);
/**
 * @desc User Profile
 * @method GET
 * @route http://localhost:{PORT}/api/v1/user/customer
 * @access private
 */
userRoute.get("/user", auth, isUser, customer);
/**
 * @desc User Logout
 * @method POST
 * @route http://localhost:{PORT}/api/v1/user/logout
 * @access private
 */
userRoute.post("/logout", auth, logout);
/**
 * @desc Token Refresh
 * @method POST
 * @route http://localhost:{PORT}/api/v1/user/refresh-token
 * @access private
 */

export default userRoute;
