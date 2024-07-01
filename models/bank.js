const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },

  accountName: { type: String, required: true },
  accountNumber: { type: Number, required: true },
  confirmAccountNumber: { type: Number, required: true },
  ifscCode: { type: String, required: true },
});

module.exports = mongoose.model("Bank", bankSchema);
