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
  createVote,
  updateVote,
  deleteVote,
  getPostsByTags,
  getPostsByComment,
  getPostsByVote,
  getComment,
  getCommentById,
} from "../controllers/index.js";

const postRoute = Router();

/**
 * @desc Get all post
 * @method GET
 * @route http://localhost:{PORT}/api/v1/post
 * @access private
 */
postRoute.get("/", auth, isUser, getPosts);
postRoute.get("/", auth, isAdmin, getPosts);

/**
 * @desc Get post by Id
 * @method POST
 * @route http://localhost:{PORT}/api/v1/post/:id
 * @access private
 */
postRoute.get(":/id", auth, isUser, getPostById);

/**
 * @desc Get post by tags : TODO
 * @method POST
 * @route http://localhost:{PORT}/api/v1/post/:id
 * @access private
 */
postRoute.get(":/id", auth, isUser, getPostsByTags);

/**
 * @desc Get post by comment : TODO
 * @method POST
 * @route http://localhost:{PORT}/api/v1/post/:id
 * @access private
 */
postRoute.get(":/id", auth, isUser, getPostsByComment);

/**
 * @desc Get post by vote :TODO
 * @method POST
 * @route http://localhost:{PORT}/api/v1/post/:id
 * @access private
 */
postRoute.get(":/id", auth, isUser, getPostsByVote);

/**
 * @desc Create a post
 * @method POST
 * @route http://localhost:{PORT}/api/v1/post/create-post
 * @access private
 */
postRoute.post("/create-post", auth, isUser, createPost);

/**
 * @desc update post
 * @method PUT
 * @route http://localhost:{PORT}/api/v1/post/:id
 * @access private
 */
postRoute.put("/:id", auth, isUser, updatePost);

/**
 * @desc delete post
 * @method DELETE
 * @route http://localhost:{PORT}/api/v1/post/:id
 * @access private
 */
postRoute.delete("/:id", auth, isUser, deletePost);

/**
 * @desc get a comment:TODO
 * @method GET
 * @route http://localhost:{PORT}/api/v1/post/get-comment/:id
 * @access private
 */
postRoute.get("/get-comment/:id", auth, isUser, getCommentById);

/**
 * @desc get ALL comment:TODO
 * @method GET
 * @route http://localhost:{PORT}/api/v1/post/get-comment
 * @access private
 */
postRoute.get("/get-comment", auth, isUser, getComment);

/**
 * @desc create a comment
 * @method POST
 * @route http://localhost:{PORT}/api/v1/post/create-comment
 * @access private
 */
postRoute.post("/create-comment/:id", auth, isUser, createComment);

/**
 * @desc update a comment
 * @method PUT
 * @route http://localhost:{PORT}/api/v1/post/create-comment
 * @access private
 */
postRoute.put("/update-comment/:id", auth, isUser, updateComment);

/**
 * @desc delete a comment
 * @method DELETE
 * @route http://localhost:{PORT}/api/v1/post/create-comment
 * @access private
 */
postRoute.delete("/delete-comment/:id", auth, isUser, deleteComment);

/**
 * @desc create a vote
 * @method POST
 * @route http://localhost:{PORT}/api/v1/post/:postId/comment/:commentId/create-vote
 * @access private
 */
postRoute.post("/:postId/comment/:commentId/create-vote", auth, isUser, createVote);

/**
 * @desc update a vote
 * @method PUT
 * @route http://localhost:{PORT}/api/v1/post/create-vote
 * @access private
 */
postRoute.put("/:postId/comment/:commentId/update-vote", auth, isUser, updateVote);

/**
 * @desc delete a vote
 * @method DELETE
 * @route http://localhost:{PORT}/api/v1/post/create-vote
 * @access private
 */
postRoute.delete("/:postId/comment/:commentId/delete-vote", auth, isUser, deleteVote);


export default postRoute;