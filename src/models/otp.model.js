import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { mailSend } from "../config/configMail.js";

const OTPSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

// send OTP

const sendVerificationMail = asyncHandler(async (email, otp) => {
  console.log(email, otp);
  const mailRes = await mailSend(
    email,
    "Verification email from CodeColab",
    otp
  );
// console.log(mailRes);
  // success
  if (mailRes) {
    console.log("Email sent ", mailRes);
  }
  // failed
  else {
    console.log("error occured when mail sending");
  }
});

OTPSchema.pre("save",async function(next){
    await sendVerificationMail(this.email,this.otp);
    next();
});

export const otpModel = mongoose.model("OTP", OTPSchema);
