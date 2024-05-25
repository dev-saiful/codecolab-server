import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

// authorization middleware
const auth = asyncHandler(async(req,res,next)=>{
    try
    {
        // Token retrive
        let accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(accessToken)
        {
           
                const decode = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
                req.user = await userModel.findOne({email:decode?.email}).select("-password -refreshToken");
                next();
            
        }
        else
        {
            throw new ApiError(401,"Not authorized, no token");
        }
    }
    catch(error)
    {
        throw new ApiError(401, error?.message || "Not authorized, token failed");
    }
});

// isAdmin middleware

const isAdmin = (req,res,next)=>{
    
    if(req.user && req.user.role === "Admin")
    {
        next();
    }
    else
    {
        throw new ApiError(401,"Not authorized as admin");
    }
}

// isUser middleware

const isUser = (req,res,next)=>{
    if(req.user && req.user.role === "User")
    {
        next();
    }
    else
    {
        throw new ApiError(401,"Not authorized as customer");
    }
}

export {auth, isAdmin, isUser};