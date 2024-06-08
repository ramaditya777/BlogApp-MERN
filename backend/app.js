import express from "express";
const app = express();

app.use("/", (req, res, next) => {
  res.send("Hello World");
});

app.listen(8000, () => {
  console.log("Successfull");
});
// console.log("Hello World7");
