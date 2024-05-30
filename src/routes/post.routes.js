import { Router } from "express";
import { auth, isAdmin, isUser } from "../middlewares/auth.middleware.js";
import { getPosts,createPost } from "../controllers/post.controller.js";

const postRoute = Router();
/**
 *  get all post
 */
postRoute.get("/",auth,isUser,getPosts);
postRoute.get("/",auth,isAdmin,getPosts);

/**
 *  create post
 */
postRoute.post("/create-post",auth,isUser,createPost);

export default postRoute;