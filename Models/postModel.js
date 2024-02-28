import mongoose from "mongoose";
import User from "./userModel.js";
const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    }
})
const Post = mongoose.model('Posts',PostSchema)
export default Post
