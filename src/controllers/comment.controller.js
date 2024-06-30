import { asyncHandler } from "../utils/asyncHandler.js";
import { postModel } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";

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
  
      // // Save the updated post to the database
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
  
export{
    createComment,
    updateComment,
    deleteComment,
};