import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, //as everyone has unique email
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    // maxlength: 20,
  },
  //Type when it was posted
  //   createdAt: {
  //     type: Date,
  //     default: Date.now,
  //   },
});

export default mongoose.model("User", userSchema);
/*
const User = mongoose.model('User', userSchema);
export default User;
*/
