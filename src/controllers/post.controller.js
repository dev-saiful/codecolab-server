import { asyncHandler } from "../utils/asyncHandler.js";
import { postModel } from "../models/index.js";
import validator from "validator";
import { ApiError } from "../utils/apiError.js";

// create post :DONE
const createPost = asyncHandler(async (req, res) => {
  const postAuthor = req.user._id;
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
    postAuthor,
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

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
  });
});

// get all post : DONE
const getPosts = asyncHandler(async (req, res) => {
  const { title } = req.query;
  let posts;

  if (title) {
    posts = await postModel.find({ title: { $regex: title, $options: "i" } });
  } else {
    posts = await postModel.find({});
  }

  // check if posts are available or not
  if (!posts || posts.length === 0) {
    throw new ApiError(400, "No posts found");
  }

  res.status(200).json({
    success: true,
    message: "Posts found",
    posts,
  });
});

// get post by id : DONE
const getPostById = asyncHandler(async (req, res) => {
  // Fetch the post by ID from the database
  const post = await postModel.findById(req.params.id);

  // Check if the post is available or not
  // The length property check is incorrect for a single post object
  // Use 'if (!post)' to check if no post is found
  if (!post) {
    // Throw an error if no post is found
    throw new ApiError(400, "Post not found");
  }

  // Return a success response with the found post
  res.status(200).json({
    success: true,
    message: "Post found",
    post,
  });
});

// get all post by comment:DONE
const getPostsByComment = asyncHandler(async (req, res) => {
  // Get the user ID from the request user object
  const userId = req.user._id;


  // Find posts where the commentAuthor matches the user ID
  const posts = await postModel.find({ "comments.commentAuthor": userId });

  // Check if no posts are found
  if (!posts) {
    // Throw an error if no posts are found
    throw new ApiError(404, "No post found");
  }

  // Return a success response with the found posts
  res.status(200).json({
    success: true,
    message: "Posts found",
    posts,
  });
});

// get all post by tags: DONE
const getPostsByTags = asyncHandler(async (req, res) => {
  // Get the tags from query parameters, split by comma, and trim spaces
  const tags = req.query.tags
    ? req.query.tags.split(",").map((tag) => tag.trim())
    : [];

  // Check if tags are provided and not empty
  if (!tags || tags.length === 0) {
    // Throw an error if no tags are provided
    throw new ApiError(400, "Tags are required");
  }

  // Find posts where the tags match any of the provided tags
  const posts = await postModel.find({ tags: { $in: tags } });

  // Return a success response with the found posts
  res.status(200).json({
    success: true,
    message: "Posts found",
    posts,
  });
});

// get all post by vote: DONE
const getPostsByVote = asyncHandler(async (req, res) => {
  // Get the user ID from the request user object
  const userId = req.user._id;

  // Find posts where the voteAuthor in comments matches the user ID
  const posts = await postModel.find({ "comments.votes.voteAuthor": userId });

  // Check if no posts are found or if the posts array is empty
  if (!posts || posts.length === 0) {
    // Throw an error if no posts are found
    throw new ApiError(404, "No posts found");
  }

  // Return a success response with the found posts
  res.status(200).json({
    success: true,
    message: "Posts found",
    posts,
  });
});

// Define the getPostsByUserId :DONE
const getPostsByUserId = asyncHandler(async (req, res) => {
  // Get the user ID from the request parameters
  const userId = req.user._id;

  // Find posts where the postAuthor matches the user ID
  const posts = await postModel.find({ postAuthor: userId });

  // Check if no posts are found
  if (!posts || posts.length === 0) {
    // Throw an error if no posts are found
    throw new ApiError(404, "No post found");
  }

  // Return a success response with the found posts
  res.status(200).json({
    success: true,
    message: "Posts found",
    posts,
  });
});

// update post:DONE
const updatePost = asyncHandler(async (req, res) => {
  // Retrieve data from body
  const { title, content, category, tags } = req.body;

  // Find the post by ID
  const post = await postModel.findById(req.params.id);

  // Check if the post is available or not
  if (!post) {
    // Throw an error if no post is found
    throw new ApiError(400, "Post not found");
  }

  // Update the post fields with new values if provided
  post.title = title || post.title;
  post.content = content || post.content;
  post.category = category || post.category;
  post.tags = tags || post.tags;

  // Save the updated post to the database
  await post.save();

  // Return a success response with the updated post
  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post,
  });
});

// delete post: DONE
const deletePost = asyncHandler(async (req, res) => {
  // Find the post by ID
  const post = await postModel.findById(req.params.id);

  // Check if the post is available or not
  if (!post) {
    // Throw an error if no post is found
    throw new ApiError(400, "No post found");
  }

  // Delete the post from the database
  await post.remove();

  // Return a success response indicating the post was deleted
  return res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});




export {
  getPosts,
  createPost,
  getPostById,
  getPostsByComment,
  getPostsByTags,
  getPostsByVote,
  updatePost,
  deletePost,getPostsByUserId,
};
