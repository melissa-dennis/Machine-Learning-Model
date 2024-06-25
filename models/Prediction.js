// prediction.js

const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  features: {
    age: Number,
    anaemia: Number,
    creatinine_phosphokinase: Number,
    diabetes: Number,
    ejection_fraction: Number,
    high_blood_pressure: Number,
    platelets: Number,
    serum_creatinine: Number,
    serum_sodium: Number,
    sex: Number,
    smoking: Number,
    time: Number
  },
  prediction: {
    type: String,
    required: true
  },
  username: String, 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Prediction = mongoose.model('Prediction', PredictionSchema);

module.exports = Prediction;
