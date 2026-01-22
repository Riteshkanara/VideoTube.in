
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";

dotenv.config({
    path: './.env'  
})
import {app} from "./app.js"

//"NOT needed right no cuz its same in the app.js"
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));

connectDB()
.then(() =>{

    app.on("error", (error)=>{
        console.log("ERROR IN APP.JS ", error);
        throw error;

    })

    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT} `);
    })
})
.catch((error)=>{
    console.log("DB CONNECTION ERROR IN INDEX.JS ", error);
    process.exit(1)
})























// THE FIRST APPROACH FOR THE DB CONNECTION AND SERVER SETUP---

// import express from "express"
// const app = express()
// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         console.log("MongoDB connected successfully");
        
//         app.on("error", (error) => {
//             console.log("ERROR", error);
//             throw error;
//         });
        
//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on PORT ${process.env.PORT}`);
            
//         });
        
//     } catch (error) {
//         console.error("Database connection error:", error);
//         throw error;
//     }
// })();