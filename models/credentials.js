const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const credentialsSchema = new Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  email: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Email",
    },
  ],
  store: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
  ],
});

module.exports = mongoose.model("Credentials", credentialsSchema);
