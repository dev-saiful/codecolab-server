import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    postAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    comments: [{ 
      type: mongoose.Schema.Types.ObjectId,
       ref: "Comment" }],
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.model("Post", postSchema);

export { postModel };
