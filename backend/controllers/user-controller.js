import User from "../model/User.js";
import bcrypt from "bcrypt";
//GEtting all Users
export const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    console.log(error);
  }
  if (!users) {
    return res.status(404).json({ message: "No User Found" });
  }
  res.status(200).json({ users });
};

//Sign up new User
export const signupUser = async (req, res, next) => {
  //Get the data from user sign from and destructure them
  const { name, email, password } = req.body;

  //Validate the data which are coming from the user
  let existUser;
  try {
    existUser = await User.findOne({ email });
  } catch (error) {
    return console.log(error);
  }
  //if user exist send an response as 400 for unauthorized access
  if (existUser) {
    return res
      .status(400)
      .json({ message: "User Already Exist ! Go For Login" });
  }
  //Before Creating New User Just Bcrypt the password
  const saltRounds = 10; // Or any other number you prefer
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  //otherwise create a new user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    blogs: [],
  });
  //Now save the user to the MongoDB.
  try {
    await user.save();
  } catch (error) {
    return console.log(error);
  }
  return res.status(201).json({ user });
};

//Login User
export const loginUser = async (req, res, next) => {
  //Get the data from user  and destructure them
  const { email, password } = req.body;
  //Check the existing user
  let existUSer;
  try {
    existUSer = await User.findOne({ email });
  } catch (error) {
    return console.log(error);
  }
  //if User Not Exist
  if (!existUSer) {
    return res.status(404).json({ message: "User Not Exist ! Go to SignUp." });
  }
  //Now get the original password and check with hashed password
  const isPasswordCorrect = bcrypt.compareSync(password, existUSer.password);
  //Chech password correct or not
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect PAssword." });
  }
  return res.status(200).json({ message: "Login Successfull." });
};
