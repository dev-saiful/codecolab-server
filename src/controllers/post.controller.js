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
    posts = await postModel.find({ title: { $regex: title, $options: 'i' } });
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
})

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
  const posts = await postModel.find({'comments.commentAuthor': userId});
  
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
  const tags = req.query.tags ? req.query.tags.split(',').map(tag => tag.trim()) : [];
  
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
  const posts = await postModel.find({ 'comments.votes.voteAuthor': userId });

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

// create post comment : DONE
const createComment = asyncHandler(async (req, res) => {
  // Retrieve the comment from the request body
  const { comment } = req.body;
  
  // Find the post by ID
  const post = await postModel.findById(req.params.id);
  
  // Check if the post is available
  if (post) {
    // Check if the user has already commented on the post
    const alreadyCommented = post.comments.find(
      (comment) => comment.commentAuthor.toString() === req.user._id.toString()
    );
    
    // If the user has already commented, throw an error
    if (alreadyCommented) {
      throw new ApiError(400, "Already commented");
    }

    // Create the new comment object
    const newComment = {
      commentAuthor: req.user._id,
      comment,
    };
    
    // Add the new comment to the post's comments array
    post.comments.push(newComment);
    
    // Save the updated post to the database
    await post.save();
    
    // Return a success response indicating the comment was created
    res.status(201).json({
      success: true,
      message: "Comment created",
    });
  } else {
    // If the post is not found, throw an error
    throw new ApiError(404, "Resource not found");
  }
});

// update post comment : DONE
const updateComment = asyncHandler(async (req, res) => {
  // Retrieve the updated comment from the request body
  const { comment } = req.body;
  
  // Find the post by ID
  const post = await postModel.findById(req.params.id);
  
  // Check if the post is available
  if (!post) {
    // Throw an error if the post is not found
    throw new ApiError(404, "Post not found");
  }
  
  // Find the comment by the current user
  const existingComment = post.comments.find(
    (comment) => comment.commentAuthor.toString() === req.user._id.toString()
  );
  
  // Check if the comment exists
  if (!existingComment) {
    // Throw an error if the comment is not found
    throw new ApiError(404, "Comment not found");
  }
  
  // Update the comment with the new content
  existingComment.comment = comment;
  
  // Save the updated post to the database
  await post.save();
  
  // Return a success response indicating the comment was updated
  res.status(200).json({
    success: true,
    message: "Comment updated",
  });
});

// delete post comment : DONE
const deleteComment = asyncHandler(async (req, res) => {
  // Find the post by ID
  const post = await postModel.findById(req.params.id);
  
  // Check if the post is available
  if (!post) {
    // Throw an error if the post is not found
    throw new ApiError(404, "Post not found");
  }

  // Find the index of the comment by the current user
  const commentIndex = post.comments.findIndex(
    (comment) => comment.commentAuthor.toString() === req.user._id.toString()
  );

  // Check if the comment exists
  if (commentIndex === -1) {
    // Throw an error if the comment is not found
    throw new ApiError(404, "Comment not found");
  }

  // Remove the comment from the comments array
  post.comments.splice(commentIndex, 1);
  
  // Save the updated post to the database
  await post.save();

  // Return a success response indicating the comment was deleted
  res.status(200).json({
    success: true,
    message: "Comment deleted",
  });
});

// hanlde Vote in a comment :DONE
const handleVote = asyncHandler(async (req, res) => {
  const { voteType } = req.body;
  const { postId, commentId } = req.params;
  const post = await postModel.findById(postId);
  
  // Check for invalid vote type
  if (!["like", "dislike"].includes(voteType)) {
    throw new ApiError(400, "Invalid vote type");
  }
   // Check for post available or not
  if (!post) {
    throw new ApiError(400, "Post not found");
  }
// Check for comments available or not
  if (post.comments.length <= 0) {
    throw new ApiError(400, "No comments found");
  }
// Check for comment available or not
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
     res.status(200).json({
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
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  handleVote,
};
