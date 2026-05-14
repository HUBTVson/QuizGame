const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: {type: Number, required: true},
    playDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Score', ScoreSchema);