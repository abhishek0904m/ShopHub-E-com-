// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String }, // Optional for OAuth users
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  providerId: { type: String }, // OAuth provider user ID
  photoURL:  { type: String }, // Profile photo from OAuth
  firstName: { type: String, default: "" },
  lastName:  { type: String, default: "" },
  mobile:    { type: String, default: "" },
  gender:    { type: String, default: "" },
  dob:       { type: String, default: "" },
  address:   { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
