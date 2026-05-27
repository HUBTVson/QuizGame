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

// update quiz title and/or section by id
exports.updateQuiz = async (req, res) => {
    try {
        const { title, section } = req.body;
        if (!title && !section) {
            return res.status(400).json({ message: 'Provide title or section to update' });
        }
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            { ...(title && { title }), ...(section && { section }) },
            { new: true }
        );
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.status(200).json({ message: 'Quiz updated', quiz });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};