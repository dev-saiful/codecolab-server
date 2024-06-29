import mongoose from "mongoose";

const voteSchema =  mongoose.Schema(
  {
    voteAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVote: {
      type: Boolean,
      default: false,
    },
    voteType: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const voteModel = mongoose.model("Vote", voteSchema);

export{
    voteModel
}