import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    fileType: {
      type: String,
      enum: ["image", "video", "document", null],
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    readAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.pre("validate", function (next) {
  if (!this.content && !this.fileUrl) {
    next(new Error("Message must have either content or a file"));
  } else {
    next();
  }
});

messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, readAt: 1 });
messageSchema.index({ createdAt: -1 });

messageSchema.virtual("isRead").get(function () {
  return this.readAt !== null;
});

messageSchema.virtual("isDelivered").get(function () {
  return this.deliveredAt !== null;
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
