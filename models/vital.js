// vital.js
const mongoose = require("mongoose");

const vitalSchema = new mongoose.Schema(
  {
    bodyTemperature: { type: Number, required: false },
    heartRate: { type: Number, required: false },
    bloodPressure: { type: String, required: false },
    respiratoryRate: { type: Number, required: false },
    weight: { type: Number, required: false },
    entryType: { type: String, required: true, enum: ["CLINICAL", "DAILY"] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);
// Define a virtual 'id' property to return _id as id
vitalSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

module.exports = vitalSchema;
