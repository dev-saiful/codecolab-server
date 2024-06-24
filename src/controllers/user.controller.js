import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import { generate } from "otp-generator";
import validator from "validator";
import { v2 } from "cloudinary";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import generateToken from "../utils/generateToken.js";
import { otpModel, userModel } from "../models/index.js";
import { checkEmail, checkEmpty, isMatch } from "../utils/validate.js";

v2.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET,
});

// send OTP
const sendOTP = asyncHandler(async (req, res) => {
  // data retrive from req.body
  const { email } = req.body;

  // check if email is already registered
  const existsEmail = await userModel.findOne({ email });
  if (existsEmail) {
    throw new ApiError(401, "User already exists");
  }

  //  generate OTP
  let otp = generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // check otp is unique
  let result = await otpModel.findOne({ otp: otp });
  while (result) {
    otp = generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    result = await otpModel.findOne({ otp: otp });
  }

  const otpData = { email, otp };

  // insert into Database
  const otpcreated = await otpModel.create(otpData);

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    otp,
  });
});

// register
const register = asyncHandler(async (req, res) => {
  const {
    fullName,
    userName,
    email,
    password,
    confirmPassword,
    cfhandle,
    cfrating,
    image,
    role,
    description,
    otp,
  } = req.body;
  console.log(otp);
  // checking empty field
  const result = checkEmpty(
    fullName,
    userName,
    email,
    password,
    confirmPassword,
    otp
  );
  if (result === false) {
    throw new ApiError(400, "All filed must be filled up");
  }
  // checking valid email
  const isMail = checkEmail(email);
  if (isMail === false) {
    throw new ApiError(
      400,
      "you can only use gmail, hotmail, yahoo, outlook, icloud"
    );
  }
  // checking password is match or not
  const isEqual = isMatch(password, confirmPassword);
  if (isEqual === false) {
    throw new ApiError(400, "Mismatch passwords");
  }
  // checking user email already exists
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User Alreday Exists");
  }

  // checking username already exists
  const username = await userModel.findOne({ userName });
  if (username) {
    throw new ApiError(400, "UserName Alreday taken, try another");
  }

  // find recent otp
  const recentOTP = await otpModel
    .find({ email })
    .sort({ createdAt: -1 })
    .limit(1);
  if (recentOTP.length == 0) {
    throw new ApiError(400, "OTP not found");
  } else if (otp !== recentOTP[0].otp) {
    throw new ApiError(400, "Invalid otp");
  }
  // hashing password
  const hashpass = await bcrypt.hash(password, 10);

  // creating user
  const user = await userModel.create({
    fullName,
    userName,
    email,
    password: hashpass,
    cfhandle,
    cfrating,
    image,
    role,
    description,
  });

  const createdUser = await userModel.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res.status(201).json({
    success: true,
    createdUser,
    message: "User registered successfully",
  });
});

// login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // checking empty field
  if (validator.isEmpty(email) || validator.isEmpty(password)) {
    throw new ApiError(400, "Field must be filled up");
  }
  // checking valid email
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid Email Address");
  }
  // checking email is exists
  const userFound = await userModel.findOne({ email });
  if (!userFound) {
    throw new ApiError(404, "User Not Found");
  }

  // compare password
  const matchPassword = await bcrypt.compare(password, userFound.password);
  if (!matchPassword) {
    throw new ApiError(400, "Incorrect Password");
  }

  // all is ok then create payload
  const { accessToken } = generateToken(res, userFound);
  await userFound.save({ validateBeforeSave: false });
  userFound.password = undefined;

  if (accessToken) {
    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      accessToken,
      userFound,
    });
  } else {
    throw new ApiError(500, "Something went wrong while logging user");
  }
});

// logout
const logout = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res.status(200).clearCookie("accessToken", options).json({
    success: true,
    message: "User Logged Out",
  });
});

// get all user
const getUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find({});
  res.status(200).json({
    success: true,
    message: "Fetch all user",
    users,
  });
});

// get user by id
const getUserById = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id).select("-password");
  console.log(user);
  if (user) {
    res
      .status(200)
      .json({
        success: true,
        message: "User fetched",
        user,
      });
  } else {
    throw new ApiError(404, "user not found");
  }
});
// update user
const updateUser = asyncHandler(async (req, res) => {

  let user = await userModel.findById(req.params.id).select("-password");
  if (!user) {
    throw new ApiError(404,"user not found");
  }
  const file = req.files.image;
  v2.uploader.upload(file.tempFilePath,async(err,result)=>{
    // const {fullName,cfhandle,cfrating,image,description} = req.body;
    if (err) {
      throw new ApiError(500, "Image upload failed");
    }
    user.fullName = req.body.fullName || user.fullName;
    user.cfhandle = req.body.cfhandle || user.cfhandle;
    user.cfrating = req.body.cfrating || user.cfrating;
    user.image = result.secure_url || user.image;
    user.description = req.body.description || user.description;

    await user.save();

     res
     .status(200)
     .json({
       success: true,
       message: "User update successfully",
       user,
     });
  });

});

// delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (user) {
    if (user.role === "Admin") {
      throw new ApiError(400, "Cannot delete admin user");
    }
    await userModel.deleteOne({ _id: user._id });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } else {
    throw new ApiError(404, "user not found");
  }
});

export {
  register,
  login,
  logout,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  sendOTP,
};
