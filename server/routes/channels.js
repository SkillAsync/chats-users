const express = require("express");
const router = express.Router();
const Channel = require("../models/channel");
const Message = require("../models/message");

router.post("/", async (req, res) => {
  const { name, participants } = req.body;
  if (participants.length !== 2) {
    return res.status(400).send("A channel must have exactly two participants");
  }
  try {
    const newChannel = new Channel({ name, participants });
    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const channels = await Channel.find({ active: true }).populate(
      "participants",
      "uuid"
    );
    res.json({ channels });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/:uuid", async (req, res) => {
  const { uuid } = req.params;

  try {
    const channels = await Channel.find({
      "participants.uuid": uuid,
      active: true,
    }).populate("participants", "uuid");

    const channelsWithLastMessage = await Promise.all(
      channels.map(async (channel) => {
        const lastMessage = await Message
          .findOne({ channel: channel.uuid })
          .sort({ createdAt: -1 })
          .limit(1);
        return { ...channel._doc, lastMessage };
      }
    ));
    res.json({ channels: channelsWithLastMessage });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
