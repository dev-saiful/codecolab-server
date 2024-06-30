import { Router } from "express";
import { auth, isAdmin, isUser } from "../middlewares/auth.middleware.js";
import {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  getPostsByTags,
  getPostsByComment,
  getPostsByVote,
  handleVote,
  getPostsByUserId,
} from "../controllers/index.js";

const postRoute = Router();

/**
 * @desc Get all posts
 * @method GET
 * @route http://localhost:{PORT}/api/v1/post
 * @access private
 */
postRoute.get("/",getPosts);

/**
 * @desc Get all posts
 * @method GET
 * @route http://localhost:{PORT}/api/v1/post
 * @access private
 */
postRoute.get("/user-post",auth,isUser,getPostsByUserId);

/**
 * @desc Get posts by commented
 * @method GET
 * @route http://localhost:{PORT}/api/v1/post/commented-post
 * @access private
 */
postRoute.get("/commented-post", auth, isUser, getPostsByComment);
postRoute.get("/commented-post", auth, isAdmin, getPostsByComment);

/**
 * @desc Get posts by tags
 * @method GET
 * @route http://localhost:{PORT}/api/v1/post/tags-post
 * @access private
 */
postRoute.get("/tags-post",  getPostsByTags);


/**
 * @desc Get posts by voted
 * @method GET
 * @route http://localhost:{PORT}/api/v1/post/voted-post
 * @access private
 */
postRoute.get("/voted-post", auth, isUser, getPostsByVote);
postRoute.get("/voted-post", auth, isAdmin, getPostsByVote);

/**
 * @desc Create a post
 * @method POST
 * @route http://localhost:{PORT}/api/v1/post/create-post
 * @access private
 */
postRoute.post("/create-post", auth, isUser, createPost);


/**
 * @desc Get post by Id
 * @method GET
 * @route http://localhost:{PORT}/api/v1/post/:id
 * @access private
 */
postRoute.get("/:id",  getPostById);


/**
 * @desc Update a post
 * @method PUT
 * @route http://localhost:{PORT}/api/v1/post/:id
 * @access private
 */
postRoute.put("/:id", auth, isUser, updatePost);

/**
 * @desc Delete a post
 * @method DELETE
 * @route http://localhost:{PORT}/api/v1/post/:id
 * @access private
 */
postRoute.delete("/:id", auth, isUser, deletePost);
postRoute.delete("/:id", auth, isAdmin, deletePost);

/**
 * @desc Create a comment
 * @method POST
 * @route http://localhost:{PORT}/api/v1/post/create-comment/:id
 * @access private
 */
postRoute.post("/create-comment/:id", auth, isUser, createComment);

/**
 * @desc Update a comment
 * @method PUT
 * @route http://localhost:{PORT}/api/v1/post/update-comment/:id
 * @access private
 */
postRoute.put("/update-comment/:id", auth, isUser, updateComment);

/**
 * @desc Delete a comment
 * @method DELETE
 * @route http://localhost:{PORT}/api/v1/post/delete-comment/:id
 * @access private
 */
postRoute.delete("/delete-comment/:id", auth, isUser, deleteComment);
postRoute.delete("/delete-comment/:id", auth, isAdmin, deleteComment);

/**
 * @desc Handle a vote on a comment
 * @method POST
 * @route http://localhost:{PORT}/api/v1/post/:postId/comment/:commentId/handle-vote
 * @access private
 */
postRoute.post("/:postId/comment/:commentId/handle-vote", auth, isUser, handleVote);



export default postRoute;