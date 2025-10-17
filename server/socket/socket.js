import Message from "../models/messageModel.js";

const onlineUsers = new Map();

export const initializeSocket = (io, auth) => {
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || "";
      const session = await auth.api.getSession({
        headers: { cookie: cookieHeader },
      });
      if (!session?.user) {
        return next(new Error("Authentication error"));
      }
      socket.user = session.user;
      next();
    } catch (error) {
      console.error("Socket Auth Error:", error);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `✅ User connected: ${socket.user.name} (ID: ${socket.user.id})`
    );
    onlineUsers.set(socket.user.id, socket.id);

    socket.on(
      "sendMessage",
      async ({
        receiverId,
        content,
        fileUrl = null,
        fileType = null,
        fileName = null,
        fileSize = null,
      }) => {
        try {
          const newMessage = await Message.create({
            sender: socket.user.id,
            receiver: receiverId,
            content: content || "",
            fileUrl,
            fileType,
            fileName,
            fileSize,
          });

          const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "name image")
            .populate("receiver", "name image");

          const receiverSocketId = onlineUsers.get(receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", populatedMessage);
          }
          socket.emit("receiveMessage", populatedMessage);
        } catch (error) {
          console.error("❌ SOCKET: CRITICAL ERROR sending message:", error);
          socket.emit("sendMessageError", {
            message: "Could not send message.",
          });
        }
      }
    );

    socket.on("deleteMessage", async ({ messageId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message || message.sender.toString() !== socket.user.id) return;

        await Message.findByIdAndDelete(messageId);

        const receiverSocketId = onlineUsers.get(message.receiver.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("messageDeleted", { messageId });
        }
        socket.emit("messageDeleted", { messageId });
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.user.name}`);
      onlineUsers.delete(socket.user.id);
    });
  });
};
