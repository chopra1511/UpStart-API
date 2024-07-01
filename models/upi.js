const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const upiSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  accountName: { type: String, required: true },
  upiID: { type: String, required: true },
});

module.exports = mongoose.model("UPI", upiSchema);
