import express from "express";
import mongoose from "mongoose";
import blogRouter from "./routes/blog-routes";
import router from "./routes/user-routes";
import cors from "cors";
import dotenv from "dotenv";

const app = express(); //all functionality of express js given to express var
dotenv.config();

app.use(cors()); //use cores before every middleware to disbles browsers cors privacy
app.use(express.json()); 
//to tell app to receive json data instead of body-parser
app.use("/api/user" ,router); //http://localhost:5000/api/user
app.use("/api/blog", blogRouter); //upper router was for user router

mongoose.connect(process.env.CONNECTION_URL)
    .then(()=> app.listen(process.env.PORT||5000))
    .then(()=> console.log("Connected to DataBase and listening to 5000"))
    .catch((err) => console.log(err));
