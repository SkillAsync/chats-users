// server/routes/messages.js

const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const { io } = require("../../server")

router.post("/:channel", async (req, res) => {
  const { channel } = req.params;
  const { user, message } = req.body;

  try {

    if (!user || !message) {
      return res.status(400).send("User and message are required");
    }

    const newMessage = new Message({ channel, user: user.username, message });
    await newMessage.save();

    io.to(channel).emit("newMessage", newMessage); 

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/:channel", async (req, res) => {
  const { channel } = req.params;
  try {
    const messages = await Message.find({ channel });
    res.json({ messages });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
