import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (error) {
    return console.log(error);
  }
  if (!blogs) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ blogs });
};

export const addBlog = async (req, res, next) => {
  //Get all the data from the request and destructure them
  const { title, description, image, user } = req.body;
  //Check wheather the user is exist or not
  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (error) {
    return console.log(error);
  }
  //if User not  Exist
  if (!existingUser) {
    return res.status(400).json({ message: "Unable To Find User By This ID" });
  }
  //If User Exist Do Below
  //Create new Blog
  const blog = new Blog({ title, description, image, user });
  // save the Blog into the db  ****DOUBT PRESENT HERE*******
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    //Add the new blog into the corresponding User List(array)
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
  return res.status(200).json({ blog });
};

export const updateBlog = async (req, res, next) => {
  //Get the data from the req.body
  const { title, description } = req.body;
  //Use request.param to get the object where the parameter are present
  const blogId = req.params.id;

  //Update the value by using findByIdAndUpdate
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, { title, description });
  } catch (error) {
    return console.log(error);
  }
  //Check wheather it update or not
  if (!blog) {
    return res.status(500).json({ message: "Unable to Update the Blog" });
  }
  return res.status(200).json({ blog });
};

export const getBlogById = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (error) {
    return console.log(error);
  }
  if (!blog) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ blog });
};

//Removing blog means remove the blog from the db as well as remove from the User array
export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;

  let blog;
  try {
    //**** DOUBT  1Hour17Min*/
    blog = await Blog.findByIdAndDelete(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (error) {
    return console.log(error);
  }
  if (!blog) {
    return res.status(400).json({ message: "No Blog Found from this id" });
  }
  return res.status(200).json({ message: "Successfully Deleted" });
};

export const getBlogsByUserId = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (error) {
    return console.log(error);
  }

  //Check wheather Blog present or not of that User
  if (!userBlogs) {
    return res.status(404).json({ message: "No Blog Found." });
  }
  return res.status(200).json({ blogs: userBlogs });
};
