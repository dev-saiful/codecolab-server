import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userModel } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import generateToken from "../utils/generateToken.js";
import { generate } from "otp-generator";
import { otpModel } from "../models/otp.model.js";
import validator from "validator";
import { checkEmail, checkEmpty, isMatch } from "../utils/validate.js";

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
  } else if (otp !== recentOTP.otp) {
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

const getUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find({});
  res.status(200).json({
    success: true,
    message: "Fetch all user",
    users,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (user) {
    res
      .status(200)
      .json({
        success: true,
        message: "User fetched",
        user,
      })
      .select("-password");
  } else {
    throw new ApiError(404, "user not found");
  }
});
// TODO : change filed names
const updateUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
        "User updated successfully"
      )
    );
  } else {
    throw new ApiError(404, "user not found");
  }
});

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
};
