require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');

const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const predictionRoutes = require('./routes/predictions');


const app = express();
const port = process.env.PORT || 5001;

// Enable CORS for all responses
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the environment variable for the MongoDB connection string
const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch(e => console.error('Failed to connect to MongoDB:', e));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/predictions', predictionRoutes);

app.use(express.json())
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.get('/', (req, res) => {
  res.send("Server is up and running!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
