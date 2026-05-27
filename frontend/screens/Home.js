import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getQuizzData } from '../services/api';

export default function HomeScreen({ navigation, route, city }) {
    const username = route.params?.username || 'Player';
    const userId = route.params?.userId;
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);

    useEffect(() => {
        async function loadQuizzes() {
            try {
                const data = await getQuizzData();
                if (Array.isArray(data) && data.length > 0) {
                    setQuizzes(data);
                    setSelectedQuizId(data[0]._id);
                }
            } catch (e) {
                Alert.alert('Error', 'Could not load quizzes list.');
            } finally {
                setLoadingQuizzes(false);
            }
        }

        loadQuizzes();
    }, []);

    const handleStartQuiz = () => {
        const selectedQuiz = quizzes.find((quiz) => quiz._id === selectedQuizId);
        if (!selectedQuiz) {
            Alert.alert('Selection required', 'Please select a quiz first.');
            return;
        }
        navigation.navigate('Quiz', { userId, selectedQuiz });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Welcome, {username}!</Text>
            {city && <Text style={styles.location}>📍 {city}</Text>}
            <Text style={styles.subtitle}>Ready to test your knowledge?</Text>

            <Text style={styles.listTitle}>Choose quiz:</Text>
            {loadingQuizzes ? (
                <ActivityIndicator size="small" color="#2196F3" style={{ marginBottom: 16 }} />
            ) : (
                <View style={styles.quizList}>
                    {quizzes.map((quiz) => {
                        const isSelected = quiz._id === selectedQuizId;
                        return (
                            <TouchableOpacity
                                key={quiz._id}
                                style={[styles.quizItem, isSelected && styles.quizItemSelected]}
                                onPress={() => setSelectedQuizId(quiz._id)}
                            >
                                <Text style={[styles.quizItemTitle, isSelected && styles.quizItemTitleSelected]}>
                                    {quiz.title}
                                </Text>
                                <Text style={[styles.quizItemSection, isSelected && styles.quizItemTitleSelected]}>
                                    {quiz.section}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

            <View style={styles.button}>
                <Button
                    title="Start Quiz"
                    onPress={handleStartQuiz}
                    color="#2196F3"
                />
            </View>
            <View style={[styles.button, { marginTop: 16 }]}>
                <Button
                    title="Statistics"
                    onPress={() => navigation.navigate('Statistics')}
                    color="#9C27B0"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
    welcome: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    location: { fontSize: 16, color: '#666', marginBottom: 20 },
    subtitle: { fontSize: 18, color: '#555', marginBottom: 20, textAlign: 'center' },
    listTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10, alignSelf: 'flex-start', width: '100%' },
    quizList: { width: '100%', marginBottom: 20 },
    quizItem: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#f8f8f8',
    },
    quizItemSelected: {
        borderColor: '#2196F3',
        backgroundColor: '#E3F2FD',
    },
    quizItemTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
    quizItemSection: { fontSize: 13, color: '#666', marginTop: 2 },
    quizItemTitleSelected: { color: '#1565C0' },
    button: { width: '60%' },
});
