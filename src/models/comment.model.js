import mongoose from "mongoose";
import { voteModel } from "./vote.model.js";

const commentSchema = mongoose.Schema(
  {
    commentAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    votes: [voteModel.schema],
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.model("Comment",commentSchema);

export{
    commentModel
}