// predictions.js

const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const Prediction = require('../models/Prediction');

router.use(express.json());

const makePrediction = (inputData) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['model_service.py', JSON.stringify(inputData)]);
    
    pythonProcess.stdout.on('data', (data) => {
      try {
        const prediction = data.toString();
        resolve(prediction.trim());
      } catch (error) {
        reject(error);
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });
  });
};

router.post('/', async (req, res) => {
  try {
    const features = req.body.features;
    const username = req.user ? req.user.username : 'Anonymous';

    const predictionResult = await makePrediction(features);

    const newPrediction = new Prediction({
      features: features,
      prediction: predictionResult,
      username: username
    });

    const savedPrediction = await newPrediction.save();
    
    res.status(201).json({ id: savedPrediction._id, prediction: predictionResult });
  } catch (error) {
    console.error('Error in prediction:', error);
    res.status(500).json({ error: 'Error making prediction' });
  }
});

module.exports = router;
