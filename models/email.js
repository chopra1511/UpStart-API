const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model("Email", emailSchema);
