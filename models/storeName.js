const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeNameSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  storeName: { type: String, required: true },
});

module.exports = mongoose.model("StoreName", storeNameSchema);
