import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
    },
    timeing:{
        type:String, 
        required:true,
    },
    timezone: {
        type: String, // Store timezone as a string
        required: true
    },
    sendedQuotes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Quote'
    }]
},{timestamps:true})


const User = mongoose.model('User',UserSchema);

export default User;