import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes.js";
import blogRouter from "./routes/blog-routes.js";
import cors from "cors";

//Get All the utlity from the Express
const app = express();

//Use middle ware to read the json data from the end point
app.use(express.json());
//Midlleware CORS for communication between frontend and backend
app.use(cors());

//Use of User Router
app.use("/api/user", router);
//Use of Blog Router
app.use("/api/blog", blogRouter);

//Connect to DataBase
mongoose
  .connect("mongodb+srv://system:manager@blogappcluster.psnnwsu.mongodb.net/")
  .then(() => {
    console.log("Successfully mongoose connected");
  })
  .catch((err) => {
    console.log(err);
  });
// app.use("/", (req, res, next) => {
//   res.send("Hello World07");
// });

//Listening at the port
app.listen(8000, () => {
  console.log("Successfull");
});
// console.log("Hello World7");
