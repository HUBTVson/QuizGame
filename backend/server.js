const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');

// Initialize Express app
const app = express();

// Middleware setup (server understands JSON data)
app.use(express.json());
app.use(cors()); // allows mobile app to talk to this server

// Tell the server to use these routes
app.use('/api/auth', authRoutes)

// Connect to MongoDB
mongoose.connect('mongodb+srv://hubtw:2002@quizgame.fgjoqhp.mongodb.net/?appName=QuizGame')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MondoDB connection error:', err));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});