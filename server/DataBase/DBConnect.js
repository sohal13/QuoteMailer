import mongoose from "mongoose";

export const DBConnected =async()=>{
    try {
        const dbconnect = await mongoose.connect(process.env.MONGODB_CONNECT);
        console.log("Connected To The QuoteMailer DataBase!!");
    } catch (error) {
        console.log("DataBase Error : ",error);
    }
}