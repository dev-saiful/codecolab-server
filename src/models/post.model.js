import mongoose, { Schema } from "mongoose";

const voteSchema = new Schema(
  {
    voteAuthor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
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

// Ensure that a user can only have one type of vote (like or dislike) per item
voteSchema.index({ voteAuthor: 1, item: 1 }, { unique: true });


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
    votes: [voteSchema],
  },
  {
    timestamps: true,
  }
);


const postSchema = mongoose.Schema(
  {
    postAuthor: {
      type: Schema.Types.ObjectId,
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

    comments: [commentSchema],
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

export {postModel };
