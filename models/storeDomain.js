const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeDomainSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },

  storeDomain: { type: String, required: true },
});

module.exports = mongoose.model("StoreDomain", storeDomainSchema);
