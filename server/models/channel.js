const mongoose = require("mongoose");
const uuid = require("uuid");

const channelSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuid.v4,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  participants: [
    {
      uuid: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Channel", channelSchema);
