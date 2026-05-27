import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button, Alert, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getQuizzData, saveScore } from '../services/api';

const CACHE_KEY = 'cached_quiz_questions';
const PROGRESS_KEY_PREFIX = 'quiz_progress_';

export default function QuizScreen({ route }) {
    const userId = route?.params?.userId;
    const selectedQuiz = route?.params?.selectedQuiz;
    const [questions, setQuestions] = useState([]);
    const [quizId, setQuizId] = useState(null);
    const [quizTitle, setQuizTitle] = useState('Quiz');
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const progressKey = `${PROGRESS_KEY_PREFIX}${selectedQuiz?._id || 'default'}`;

    // fetch questions from Backend when the screen loads
    useEffect(() => {
        async function loadQuizData() {
            try {
                if (selectedQuiz && Array.isArray(selectedQuiz.questions) && selectedQuiz.questions.length > 0) {
                    setQuestions(selectedQuiz.questions);
                    setQuizId(selectedQuiz._id);
                    setQuizTitle(selectedQuiz.title || 'Quiz');
                    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(selectedQuiz.questions));
                } else {
                    const data = await getQuizzData();
                    // if backend returns an array of quizzes, we take the first one
                    if (data && data.length > 0) {
                        const questions = data[0].questions;
                        setQuestions(questions);
                        setQuizId(data[0]._id);
                        setQuizTitle(data[0].title || 'Quiz');
                        // save only the questions array to cache
                        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(questions));
                    }
                }
                // restore saved progress if exists
                const savedProgress = await AsyncStorage.getItem(progressKey);
                if (savedProgress) {
                    const { index, savedScore } = JSON.parse(savedProgress);
                    setCurrentQuestionIndex(index);
                    setScore(savedScore);
                }
                setLoading(false);
            } catch (error) {
                // server is not available- try to load a cache
                try {
                    const cached = await AsyncStorage.getItem(CACHE_KEY);
                    if (cached) {
                        setQuestions(JSON.parse(cached));
                        // restore saved progress
                        const savedProgress = await AsyncStorage.getItem(progressKey);
                        if (savedProgress) {
                            const { index, savedScore } = JSON.parse(savedProgress);
                            setCurrentQuestionIndex(index);
                            setScore(savedScore);
                        }
                        Alert.alert("Offline Mode", "Could not reach server. Loaded questions from cache.");
                    } else {
                        Alert.alert("Error", "Could not load quiz questions and no cache available.");
                    }
                } catch (cacheError) {
                    Alert.alert("Error", "Could not load quiz questions.");
                }
                setLoading(false);
            }
        }
        loadQuizData();
    }, []);

    // validate input, check answer and move to next question
    const handleNextQuestion = () => {
        if (selectedOption === null) {
            Alert.alert("Selection Required", "Please select an answer before moving to the next question.");
            return;
        }

        // check if the answer is correct
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        const newScore = isCorrect ? score + 1 : score;
        if (isCorrect) setScore(newScore);

        // move to the next question or complete the quiz
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setSelectedOption(null);
            // save progress to AsyncStorage
            AsyncStorage.setItem(progressKey, JSON.stringify({ index: nextIndex, savedScore: newScore }));
        } else {
            setQuizCompleted(true);
            // clear progress when quiz is completed
            AsyncStorage.removeItem(progressKey);
            // save score to backend
            if (userId && quizId) {
                saveScore(userId, quizId, newScore).catch(() => {});
            }
        }
    };

    // showing a loading spinner while fetching data from node.js
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading Quiz...</Text>
            </View>
        );
    }

    // display quiz results screen
    if (quizCompleted) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Quiz Completed!!!</Text>
                <Text style={styles.progress}>{quizTitle}</Text>
                <Text style={styles.scoreText}>Your Score: {score} / {questions.length}</Text>
                <Button title="Play Again" onPress={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedOption(null);
                    setScore(0);
                    setQuizCompleted(false);
                    AsyncStorage.removeItem(progressKey);
                }} />
            </View>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.progress}>{quizTitle}</Text>
            <Text style={styles.progress}>Question {currentQuestionIndex + 1} of {questions.length}</Text>
            <Text style={styles.questionText}>{currentQuestion?.questionText}</Text>
            {currentQuestion?.options?.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.optionButton, selectedOption === option && styles.selectedOptionButton]}
                    onPress={() => setSelectedOption(option)}
                >
                    <Text style={[styles.optionText, selectedOption === option && styles.selectedOptionText]}>
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
            <View style={{ marginTop: 20 }}>
                <Button title="Next Question" onPress={handleNextQuestion} color="#00ff00" />
            </View>
        </View>
    );
}

// Styling for a clean interface
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