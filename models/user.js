const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ["guest", "host"] },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }],
});

module.exports = mongoose.model("User", userSchema);
