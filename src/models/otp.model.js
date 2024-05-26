import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { mailSend } from "../config/configMail";

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
  const mailRes = await mailSend(
    email,
    "Verification email from CodeColab",
    otp
  );
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
