import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Must be fill up fullname"],
      minLength: [8,"Minimum length 8"],
      maxLenght: [32,"Maximum length 32"],
    },
    userName: {
      type: String,
      unique: true,
      required: [true, "Must be fill up username"],
      minLength: [8,"Minimum length 8"],
      maxLenght: [32,"Maximum length 32"],
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
      minLength: [8,"Minimum length 8"],
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
    token:{
      type:String,
    },
    resetPassExpiry:{
      type:Date,
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("User",userSchema);
