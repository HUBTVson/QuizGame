const mongoose = require('mongoose');
const Score = require('../models/Score');

// Save score after quiz completion
exports.saveScore = async (req, res) => {
    try {
        const { userId, quizId, score } = req.body;

        if (!userId || !quizId || score === undefined) {
            return res.status(400).json({ message: 'userId, quizId and score are required' });
        }

        const newScore = new Score({ user: userId, quiz: quizId, score });
        await newScore.save();

        res.status(201).json({ message: 'Score saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get leaderboard - total score per user, sorted descending
exports.getLeaderboard = async (req, res) => {
    try {
        const { quizId } = req.query;
        const matchStage = {};

        if (quizId) {
            if (!mongoose.Types.ObjectId.isValid(quizId)) {
                return res.status(400).json({ message: 'Invalid quizId' });
            }
            matchStage.quiz = new mongoose.Types.ObjectId(quizId);
        }

        const leaderboard = await Score.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$user',
                    totalScore: { $sum: '$score' },
                    gamesPlayed: { $sum: 1 }
                }
            },
            { $sort: { totalScore: -1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    _id: 0,
                    username: '$userInfo.username',
                    totalScore: 1,
                    gamesPlayed: 1
                }
            }
        ]);

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
