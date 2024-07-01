const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeThemeSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },

  storeTheme: { type: String, required: true },
});

module.exports = mongoose.model("StoreTheme", storeThemeSchema);
