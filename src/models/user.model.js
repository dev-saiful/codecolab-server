import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Must be fill up fullname"],
      minLength: 8,
      maxLenght: 32,
    },
    userName: {
      type: String,
      unique: true,
      required: [true, "Must be fill up username"],
      minLength: 8,
      maxLenght: 32,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Must be fill up email"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Must be fill up password"],
    },
    cfhandle: {
      type: String,
    },
    cfrating: {
      type: Number,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("User",userSchema);
