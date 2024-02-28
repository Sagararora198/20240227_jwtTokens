import mongoose from "mongoose";
import User from "./userModel";
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
const Post = mongoose.model('Post',PostSchema)
export default Post
