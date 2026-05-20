import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button, Alert, ActivityIndicator} from 'react-native';
import { getQuizzData } from '../services/api';

export default function QuizScreen() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // fetch questions from Backend when the screen loads
    useEffect(() => {
        async function loadQuizData() {
            try {
                const data = await getQuizzData();
                // if backend returns an array of quizzes, we take the first one
                if (data && data.length > 0) {
                    setQuestions(data[0].questions);
                }
                setLoading(false);
            } catch (error) {
                Alert.alert("Error", "Could not load quiz questions.")
                setLoading(false);
            }
        }
        loadQuizData();
    }, []);

    // validate input before processing
    const handleNextQuestion = () => {
        if (selectedOption === null) {
            Alert.alert("Selection Required", "Please select an asnwer before moving to the next question.")
            return;
        }
    }

    // check if the answer is correct
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
        setScore(prevScore => prevScore + 1);
    }

    // move to the next question or complete the quiz
    if(currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedOption(null); // reset selection for the next question
    } else {
        setQuizCompleted(true);
    }
};

// showing a loading spinner while fetching data from node.js
if(loading) {
    return (
        <View style={StyleSheet.center}>
            <ActivityIndicator size = "large" color = "#0000ff" />
            <Text>Loading Quiz...</Text>
        </View>
    );
}

// display quiz results screen
if (quizCompleted) {
    return (
        <View style={StyleSheet.container}>
            <Text style={StyleSheet.title}>Quiz Completed!!!</Text>
            <Text style={StyleSheet.scoreText}>Your Score: {score} / {questions.length}</Text>
            <Button title="Play Again." onPress={() => {
                setCurrentQuestionIndex(0);
                setSelectedOption(null);
                setScore(0);
                setQuizCompleted(false);
            }} />
        </View>
    );
}

const currentQuestion = question[currentQuestionIndex];

return (
    <View style={StyleSheet.container}>
        {/* Progress Indicator */}
        <Text style={StyleSheet.progress}>Question {currentQuestionIndex + 1} of {questions.length}</Text>

        {/* Question Text */}
        <Text style={StyleSheet.questionText}>{currentQuestion?.questionText}</Text>

        {/* Answer Options */}
        {currentQuestion?.options.map((option, index) => (
            <TouchableOpacity
            key={index}
            style={[
                StyleSheet.optionButton,
                selectedOption === option && StyleSheet.selectedOptionButton
            ]}
            onPress={() => setSelectedOption(option)}
        >
            <Text style={[
                StyleSheet.optionText,
                selectedOption === option && StyleSheet.selectedOptionText
            ]}>{option}
            </Text>
        </TouchableOpacity>
        ))}

        {/* Next Button */}
        <View style={{ marginTop: 20}}>
            <Button title = "Next Question" onPress={handleNextQuestion} color='#00ff00'></Button>
        </View>
    </View>
);

// Styling for a clean, clean interface
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  progress: { fontSize: 14, color: '#666', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  questionText: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  optionButton: { padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginVertical: 8, backgroundColor: '#f9f9f9' },
  selectedOptionButton: { borderColor: '#2196F3', backgroundColor: '#E3F2FD' },
  optionText: { fontSize: 16, color: '#333' },
  selectedOptionText: { color: '#2196F3', fontWeight: 'bold' },
  scoreText: { fontSize: 22, textAlign: 'center', marginVertical: 20, color: '#4CAF50', fontWeight: 'bold' }
});