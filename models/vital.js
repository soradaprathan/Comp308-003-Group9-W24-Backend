<<<<<<< HEAD
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
=======
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
>>>>>>> 019635e (GraphQL schema resolver, closes #3)
// Define a virtual 'id' property to return _id as id
vitalSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

module.exports = vitalSchema;
