const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  completeAddress: { type: String, required: true },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: Number, required: true },
  addressName: { type: String, required: true },
});

module.exports = mongoose.model("Address", addressSchema);
