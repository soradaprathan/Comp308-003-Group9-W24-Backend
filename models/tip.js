const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema({
  nurseId: {
    type: String,
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  tipName: {
    type: String,
    required: true,
  },
  tipDescription: {
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
tipSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model("Tip", tipSchema);
