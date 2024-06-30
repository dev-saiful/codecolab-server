import { asyncHandler } from "../utils/asyncHandler.js";
import { postModel } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";

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

  export{
    handleVote,
  }