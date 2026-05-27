const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

// POST http://localhost:5000/api/scores
router.post('/', scoreController.saveScore);

// GET http://localhost:5000/api/scores/leaderboard
router.get('/leaderboard', scoreController.getLeaderboard);

module.exports = router;
