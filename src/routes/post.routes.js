import { Router } from "express";

import { auth, isAdmin, isUser } from "../middlewares/auth.middleware.js";

const postRoute = Router();
/**
 * TODO : get all post
 */
postRoute.get("/",getPosts);