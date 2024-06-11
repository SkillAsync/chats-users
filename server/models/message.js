const mongoose = require("mongoose");
const channel = require("./channel");

const messageSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    channel: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    read: { type: Boolean, default: false },
    sent: { type: Boolean, default: false },
    delivered: { type: Boolean, default: false },
    edited: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("Message", messageSchema);
