const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  storeName: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreName",
    },
  ],
  storeDomain: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreDomain",
    },
  ],

  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  bankDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },
  ],
  upiDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UPI",
    },
  ],
  address: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
  storeTheme: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreTheme",
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
  ],
});

module.exports = mongoose.model("Store", storeSchema);
