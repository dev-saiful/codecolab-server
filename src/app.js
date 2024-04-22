import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
// import userRoute from "./routes/user.routes.js";
// import uploadRoute from "./routes/upload.routes.js";
dotenv.config();

export const app = express();
/**
 * @desc middlewares needed
 */
app.use(cors({
    origin:["http://localhost:3000"],
    credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
// app.use("/api/v1/user",userRoute);
// app.use("api/v1/upload",uploadRoute);


const __dirname = path.resolve();
app.use("/uploads",express.static(path.join(__dirname,"/uploads")));

if(process.env.NODE_ENV==="production")
{
    // set static folder
    app.use(express.static(path.join(__dirname,"/client/dist")));

    // any route that is not api will be redirected to index.html
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"..","client","dist","index.html"));
    });
}
else
{
    app.get("/",(req,res)=>{
        res.send("Api is running");
    });
}
