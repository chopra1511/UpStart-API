const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },

  category: { type: String, required: true },
});

module.exports = mongoose.model("Category", categorySchema);
