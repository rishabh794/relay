import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: "user",
  }
);

userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });

const User = mongoose.model("User", userSchema);

export default User;
