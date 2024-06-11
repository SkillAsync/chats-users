// server/server.js

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");
const channelRoutes = require("./server/routes/channels");
const messageRoutes = require("./server/routes/messages");
const User = require("./server/models/user");
const Message = require("./server/models/message");

// Configuración de la base de datos
mongoose
  .connect(config.databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(cors());

// Rutas
app.use("/channels", channelRoutes);
app.use("/messages", messageRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("joinChannel", async (channel) => {
    socket.join(channel);
    try {
      const messages = await Message.find({ channel }).sort({ createdAt: 1 });
      socket.emit("channelMessages", messages);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("sendMessage", async (data) => {
    const { channel, user, message } = data;
    try {
      const newMessage = new Message({ channel, user, message, sent: true });
      await newMessage.save();
      io.to(channel).emit("newMessage", newMessage);

      const lastMessage = await Message.findOne({ channel })
        .sort({ createdAt: -1 })
        .limit(1);
      io.to(channel).emit("lastMessage", lastMessage);
      
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("messageSent", async (messageId) => {
    await Message.findByIdAndUpdate(messageId, { sent: true });
  });

  socket.on("messageDelivered", async (messageId) => {
    await Message.findByIdAndUpdate(messageId, { delivered: true });
  });

  socket.on("messageRead", async (messageId) => {
    await Message.findByIdAndUpdate(messageId, { read: true });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
