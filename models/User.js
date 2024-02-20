import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  chats: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    default: [],
  },
});

let User;

try {
  // Attempt to retrieve an existing model to prevent OverwriteModelError
  User = mongoose.model("User");
} catch (error) {
  // Model doesn't exist, create a new one
  User = mongoose.model("User", UserSchema);
}

export default User;
