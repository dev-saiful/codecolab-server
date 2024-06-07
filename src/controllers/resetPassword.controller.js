import validator from "validator";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userModel } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import {mailSend} from "../config/configMail.js";
import {isMatch} from '../utils/validate.js';

//  reset password token generate
const resetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // check user already register
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Your email is not registered");
  }

  // generate token
  const token = crypto.randomUUID();
  // update user token and expiry
  const updateRes = await userModel.findOneAndUpdate(
    { email: email },
    { token: token, resetPassExpiry: Date.now() + 5 * 60 * 1000 },
    {new:true},
  );
//   create url
let frontPort = 3000;
const url = `http://localhost:${frontPort}/reset-password/${token}`;
// send mail
await mailSend(email,"Reset Password Link Sent",`Reset your password with this link ${url}`);

return res.status(200).json({
    success:true,
    message:"Email sent successfully",
})
});

// reset password

const resetPassword = asyncHandler(async(req,res)=>{
    const {token,password,confirmPassword} = req.body;
    // check is empty
    let flag = (validator.isEmpty(password) || validator.isEmpty(confirmPassword));
    if(flag)
        {
            throw new ApiError(400,"Field must be filled up");
        }
// password and confirmPassword is match
flag = isMatch(password,confirmPassword);
    if(flag===false)
    {
        throw new ApiError(400,"Passwords mismatch");
    }

    // get user info
    const userInfo = await userModel.findOne({token:token});
    if(!userInfo)
        {
            throw new ApiError(400,"Invalid token");
        }
        // check token is expire or not
        if(userInfo.resetPassExpiry < Date.now())
            {
                throw new ApiError(400,"Token is expires, please regenerate token");
            }

            // hashing password
            const hashpass = await bcrypt.hash(password,10);

            // update password
            const updatedPassword = await userModel.findOneAndUpdate({token:token},{password:hashpass},{new:true});

            if(!updatedPassword)
                {
                    throw new ApiError(500,"Something went wrong while reset password, please try again later");
                }

                return res.status(200).json({
                    success:true,
                    message:"Password reset successfully",
                });
});



// change password

const changePassword = asyncHandler(async(req,res)=>{

});

export {
    resetPasswordToken,
    resetPassword,
    changePassword,
}
