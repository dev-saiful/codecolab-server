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

  return res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
  });
});

// get all post : DONE
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
const getPostsByComment = asyncHandler(async (req, res) => {});

// get all post by tags: TODO
const getPostsByTags = asyncHandler(async (req, res) => {});

// get all post by vote: TODO
const getPostsByVote = asyncHandler(async (req, res) => {});

// get post by id : DONE
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

// update post:DONE
const updatePost = asyncHandler(async (req, res) => {
  // retrive data from body
  const { title, content, category, tags } = req.body;
  const post = await postModel.findById(req.params.id);
  // check post available or not
  if (post.length < 0) {
    throw new ApiError(400, "Post not found");
  }
post.title = title || post.title;
post.content = content || post.content;
post.category = category || post.category;
post.tags = tags || post.tags;
await post.save();
   res.status(200).json({
    success: true,
    message: "Post update successfully",
    post,
  });
});

// delete post: DONE
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

// create post comment : DONE
const createComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const post = await postModel.findById(req.params.id);
  if (post) {
    const alreadyCommented = post.comments.find(
      (comment) => comment.commentAuthor.toString() === req.user._id.toString()
    );
    if (alreadyCommented) {
   throw new ApiError(400,"Already commented");
    }

    const createComment = {
      commentAuthor: req.user._id,
      comment,
    };
    post.comments.push(createComment);
    await post.save();
    res.status(201).json({
      success: true,
      message: "Comment created",
    });
  } else {
    throw new ApiError(404, "Resource not found");
  }
});

// get  comment by id:TODO
const getCommentById = asyncHandler(async(req,res)=>{

});

// get all comment :TODO
const getComment = asyncHandler(async(req,res)=>{

});



// update post comment : DONE
const updateComment = asyncHandler(async (req, res) => {
  const {comment} = req.body;
  const post = await postModel.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const existingComment = post.comments.find(
    (comment) => comment.commentAuthor.toString() === req.user._id.toString()
  );
 
  if(!existingComment)
    {
      throw new ApiError(404, "Comment not found");
    }
  existingComment.comment = comment;
await post.save();
  res.status(200).json({
    success: true,
    message: "Comment updated",
  });
});

// delete post comment : DONE
const deleteComment = asyncHandler(async (req, res) => {
  const post = await postModel.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const commentIndex = post.comments.findIndex(
    (comment) => comment.commentAuthor.toString() === req.user._id.toString()
  );

  if (commentIndex === -1) {
    throw new ApiError(404, "Comment not found");
  }

  post.comments.splice(commentIndex, 1);
  await post.save();

  res.status(200).json({
    success: true,
    message: "Comment deleted",
  });
});

// hanlde Vote in a comment
const handleVote = asyncHandler(async (req, res) => {
  const { voteType } = req.body;
  const { postId, commentId } = req.params;
  const post = await postModel.findById(postId);
  
  // Check for invalid vote type
  if (!["like", "dislike"].includes(voteType)) {
    throw new ApiError(400, "Invalid vote type");
  }
  
  if (!post) {
    throw new ApiError(400, "Post not found");
  }

  if (post.comments.length <= 0) {
    throw new ApiError(400, "No comments found");
  }

  const comment = post.comments.id(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if the user has already voted on this comment
  const existingVoteIndex = comment.votes.findIndex(
    (vote) => vote.voteAuthor.toString() === req.user._id.toString()
  );

  if (existingVoteIndex !== -1) {
    // User has already voted
    if (comment.votes[existingVoteIndex].voteType === voteType) {
      // If the same vote type is sent twice, remove the vote
      comment.votes.splice(existingVoteIndex, 1);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Vote removed",
      });
    } else {
      // Update the existing vote
      comment.votes[existingVoteIndex].voteType = voteType;
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Vote updated",
      });
    }
  } else {
    // User has not voted yet, create a new vote
    comment.votes.push({
      voteAuthor: req.user._id,
      item: commentId, // Assuming you store comment ID in vote.item
      isVote: true, // Optional: You can manage this based on your logic
      voteType,
    });
    await post.save();
    return res.status(200).json({
      success: true,
      message: "Vote registered",
    });
  }
});

export {
  getPosts,
  createPost,
  getPostById,
  getPostsByComment,
  getPostsByTags,
  getPostsByVote,
  getComment,
  getCommentById,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  handleVote,
};
