const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  alertName: {
    type: String,
    required: true,
  },
  alertDescription: {
    type: String,
    required: true,
  },
  status: { type: String, required: true, enum: ["ACTIVE", "INACTIVE"] },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
// Define a virtual 'id' property to return _id as id
alertSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model("Alert", alertSchema);
