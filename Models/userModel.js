import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    jwt_token:{
        type:String,
        
    }
})
const User = mongoose.model('users',userSchema)
export default User