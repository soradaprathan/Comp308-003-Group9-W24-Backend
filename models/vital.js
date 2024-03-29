const mongoose = require("mongoose");

const vitalSchema = new mongoose.Schema({
  bodyTemperature: { type: String, required: false },
  heartRate: { type: String, required: false },
  bloodPressure: { type: String, required: false },
  respiratoryRate: { type: String, required: false },
  weight: { type: String, required: false },
  entryType: { type: String, required: true, enum: ["CLINICAL", "DAILY"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Reference to User model
  addedBy: {
    type: String,
    required: false,
  },
});
// Define a virtual 'id' property to return _id as id
vitalSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

module.exports = vitalSchema;
