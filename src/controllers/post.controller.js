import { asyncHandler } from "../utils/asyncHandler";
import { postModel } from "../models/post.model";
import { isEmpty } from "validator";
import { ApiError } from "../utils/apiError";

// create post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, tags } = req.body;
  // check field is empty or not
  let flag = isEmpty(title) || isEmpty(content) || isEmpty(category);
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
    success:true,
    message:"Posts found",
    posts,
});

});

export { getPosts, createPost };
