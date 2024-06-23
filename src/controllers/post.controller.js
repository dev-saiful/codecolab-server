import { asyncHandler } from "../utils/asyncHandler.js";
import { commentModel, postModel } from "../models/index.js";
import validator from "validator";
import { ApiError } from "../utils/apiError.js";

// create post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, tags } = req.body;
  // check field is empty or not
  let flag =
    validator.isEmpty(title) ||
    validator.isEmpty(content) ||
    validator.isEmpty(category);
  if (flag) {
    throw new ApiError(400, "Field must be filled up");
  }

  // create post and save into db
  const post = await postModel.create({
    title,
    content,
    category,
    tags,
  });

  if (!post) {
    throw new ApiError(
      500,
      "Something went wrong while creating post, try again later"
    );
  }

  return res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
  });
});

// get all post
const getPosts = asyncHandler(async (req, res) => {
  const posts = await postModel.find({});
  // check post available or not
  if (posts.length < 0) {
    throw new ApiError(400, "No posts found");
  }
  return res.status(200).json({
    success: true,
    message: "Posts found",
    posts,
  });
});

// get all post by comment:TODO
const getPostsByComment = asyncHandler(async(req,res)=>{

});


// get all post by tags: TODO
const getPostsByTags = asyncHandler(async(req,res)=>{

});

// get post by id
const getPostById = asyncHandler(async (req, res) => {
  const post = await postModel.findById(req.params.id);
  // check post available or not
  if (post.length < 0) {
    throw new ApiError(400, "Post not found");
  }
  return res.status(200).json({
    success: true,
    message: "Post found",
    post,
  });
});

// update post:TODO
const updatePost = asyncHandler(async (req, res) => {
  // retrive data from body
  const { title, content, category, tags } = req.body;
  const post = await postModel.findById(req.params.id);
  // check post available or not
  if (post.length < 0) {
    throw new ApiError(400, "Post not found");
  }
  return res.status(200).json({
    success: true,
    message: "Post update successfully",
    post,
  });
});

// delete post: TODO
const deletePost = asyncHandler(async (req, res) => {
  const post = await postModel.findById(req.params.id);
  // check post available or not
  if (post.length < 0) {
    throw new ApiError(400, "No post found");
  }
  return res.status(200).json({
    success: true,
    message: "Post delete successfully",
    post,
  });
});

// create post comment : TODO
const createComment = asyncHandler(async (req, res) => {
  const user = req.user;
  const {comment} = req.body;
  await commentModel.findOne({commentAuthor:user._id});
});

// update post comment : TODO
const updateComment = asyncHandler(async (req, res) => {});

// delete post comment : TODO
const deleteComment = asyncHandler(async (req, res) => {});

// create a vote in a comment: TODO
const createVote = asyncHandler(async (req, res) => {});

// update a vote in a comment: TODO
const updateVote = asyncHandler(async (req, res) => {});

// delete a vote in a comment: TODO
const deleteVote = asyncHandler(async (req, res) => {});

export { getPosts, createPost, getPostById, getPostsByComment,getPostsByTags, updatePost, deletePost,createComment,updateComment,deleteComment,createVote,updateVote,deleteVote };
