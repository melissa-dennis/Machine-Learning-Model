const { spawn } = require('child_process');

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

module.exports = makePrediction;
