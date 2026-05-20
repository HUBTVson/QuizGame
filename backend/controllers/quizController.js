const Quiz = require('../models/Quiz');

// downloading all quizzes
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({message: "Error while downloading quizzes", error})
    }
};

// adding a new quiz (testing)
exports.createQuiz = async (req, res) => {
    try {
        const { title, section, questions} = req.body;

        if (!title || !section || !questions || questions.length === 0) {
            return res.status(400).json({message: "All fields and min one question are required"})
        }

        const newQuiz = new Quiz({title, section, questions});
        await newQuiz.save();

        res.status(201).json({message: "Quiz was successfully added to db!", quiz: newQuiz});
    } catch (error) {
        res.status(500).json({message: "Error during saving quiz", error})
    }
};