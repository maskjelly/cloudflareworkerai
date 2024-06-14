import mongoose from "mongoose";

const URLS = process.env.MONGOOSE_URL;

mongoose
  .connect(URLS, {
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
  })
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const userSchema = new mongoose.Schema({
  prompt: String,
  count: {
    type: Number,
    default: 1,
  },
  lastSaved: {
    type: Date,
    default: Date.now,
  },
  image: String, // Base64 encoded image
});

const UserPrompts =
  mongoose.models.UserPrompts || mongoose.model("UserPrompts", userSchema);

export default UserPrompts;
