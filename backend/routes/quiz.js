const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// GET http://localhost:5000/api/quizzes
router.get('/', quizController.getAllQuizzes);

// POST http://localhost:5000/api/quizzes
router.post('/', quizController.createQuiz);

module.exports = router;