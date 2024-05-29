import { Router } from "express";
import { auth, isAdmin, isUser } from "../middlewares/auth.middleware.js";
import { getPosts } from "../controllers/post.controller.js";

const postRoute = Router();
/**
 * TODO : get all post
 */
postRoute.get("/",getPosts);

export default postRoute;