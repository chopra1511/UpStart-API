const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: { type: String, required: true },
});

const productSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  images: [imageSchema],
  name: { type: String },
  price: { type: Number },
  discount: { type: Number },
  skuID: { type: String },
  description: { type: String },
  weight: { type: Number },
  available: { type: Boolean },
});

module.exports = mongoose.model("Products", productSchema);
