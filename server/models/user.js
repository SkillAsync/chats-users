const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  uuid: { type: String, required: true},
});

module.exports = mongoose.model("User", userSchema);
