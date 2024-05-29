import mongoose, { Schema } from "mongoose";

const commentSchema = mongoose.Schema({
    commentAuthor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    comment:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
});


const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    postAuthor:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,

    },
    comments:[commentSchema],
    vote:{
        type:Boolean
    },
    category:{
        type:String,
        required:true,
    },
    tags:{
        type:String,
    }
},{
    timestamps:true,
});


export const postModel = mongoose.model("Post",postSchema);