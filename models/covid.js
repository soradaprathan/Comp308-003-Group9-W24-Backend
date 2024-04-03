const mongoose = require("mongoose");

const covidSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  shortnessOfBreath: { type: Number, required: true },
  feverOrChills: { type: Number, required: true },
  dryCough: { type: Number, required: true },
  soreThroat: { type: Number, required: true },
  congestionOrRunnyNose: { type: Number, required: true },
  Headache: { type: Number, required: true },
  Fatigue: { type: Number, required: true },
  muscleOrBodyAches: { type: Number, required: true },
  lossOfTasteOrSmell: { type: Number, required: true },
  risk: { type: String, required: true },
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
covidSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model("Covid", covidSchema);
