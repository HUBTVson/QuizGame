import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { getLeaderboard, getQuizzData } from '../services/api';

export default function StatisticsScreen({ navigation }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const normalizeQuizTitle = (title) => {
        const normalized = (title || '').trim().toLowerCase();
        if (normalized.includes('chess master')) return 'chess master';
        if (normalized.includes('ice hokey') || normalized.includes('ice hockey')) return 'ice hokey';
        return title;
    };

    const fetchLeaderboard = async () => {
        try {
            setError(null);
            const data = await getLeaderboard(selectedQuizId);
            if (Array.isArray(data)) {
                setLeaderboard(data);
            } else {
                setError('Could not load leaderboard.');
            }
        } catch (err) {
            setError('Could not connect to server.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        async function loadQuizzes() {
            try {
                const data = await getQuizzData();
                if (Array.isArray(data)) {
                    setQuizzes(data);
                    if (data.length > 0) {
                        setSelectedQuizId(data[0]._id);
                    }
                }
            } catch (err) {
                setError('Could not load quizzes list.');
            } finally {
                setLoadingQuizzes(false);
            }
        }

        loadQuizzes();
    }, []);

    useEffect(() => {
        if (!loadingQuizzes && selectedQuizId) {
            setLoading(true);
            fetchLeaderboard();
        }
    }, [loadingQuizzes, selectedQuizId]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchLeaderboard();
    }, []);

    const renderItem = ({ item, index }) => {
        let medalColor = '#555';
        if (index === 0) medalColor = '#FFD700';
        else if (index === 1) medalColor = '#C0C0C0';
        else if (index === 2) medalColor = '#CD7F32';

        return (
            <View style={styles.row}>
                <Text style={[styles.rank, { color: medalColor }]}>#{index + 1}</Text>
                <Text style={styles.username}>{item.username}</Text>
                <View style={styles.stats}>
                    <Text style={styles.totalScore}>{item.totalScore} pts</Text>
                    <Text style={styles.games}>{item.gamesPlayed} {item.gamesPlayed === 1 ? 'game' : 'games'}</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#9C27B0" />
                <Text style={styles.loadingText}>Loading leaderboard...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <View style={{ marginTop: 20, width: '60%' }}>
                    <Button title="Retry" onPress={() => { setLoading(true); fetchLeaderboard(); }} color="#9C27B0" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏆 Leaderboard</Text>
            <Text style={styles.filterTitle}>Quiz:</Text>
            {loadingQuizzes ? (
                <ActivityIndicator size="small" color="#9C27B0" style={{ marginBottom: 12 }} />
            ) : (
                <FlatList
                    horizontal
                    data={quizzes}
                    keyExtractor={(item) => item._id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.quizTabs}
                    renderItem={({ item }) => {
                        const isSelected = item._id === selectedQuizId;
                        return (
                            <TouchableOpacity
                                style={[styles.quizTab, isSelected && styles.quizTabSelected]}
                                onPress={() => setSelectedQuizId(item._id)}
                            >
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={[styles.quizTabText, isSelected && styles.quizTabTextSelected]}
                                >
                                    {normalizeQuizTitle(item.title)}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
            {leaderboard.length === 0 ? (
                <Text style={styles.emptyText}>No scores yet for selected quiz.</Text>
            ) : (
                <FlatList
                    data={leaderboard}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#9C27B0']} />}
                    contentContainerStyle={styles.list}
                />
            )}
            <View style={styles.backButton}>
                <Button title="Back to Home" onPress={() => navigation.goBack()} color="#9C27B0" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#333' },
    filterTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 8 },
    quizTabs: { paddingBottom: 8 },
    quizTab: {
        paddingHorizontal: 16,
        paddingVertical: 3,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bbb',
        marginRight: 6,
        backgroundColor: '#fff',
    },
    quizTabSelected: {
        borderColor: '#9C27B0',
        backgroundColor: '#F3E5F5',
    },
    quizTabText: { color: '#555', fontSize: 12, maxWidth: 140 },
    quizTabTextSelected: { color: '#6A1B9A', fontWeight: '700' },
    list: { paddingBottom: 16 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    rank: { fontSize: 20, fontWeight: 'bold', width: 44 },
    username: { flex: 1, fontSize: 17, fontWeight: '500', color: '#333' },
    stats: { alignItems: 'flex-end' },
    totalScore: { fontSize: 18, fontWeight: 'bold', color: '#9C27B0' },
    games: { fontSize: 12, color: '#888', marginTop: 2 },
    emptyText: { textAlign: 'center', color: '#888', fontSize: 16, marginTop: 40 },
    loadingText: { marginTop: 12, color: '#666' },
    errorText: { color: '#e53935', fontSize: 16, textAlign: 'center' },
    backButton: { marginTop: 12, marginBottom: 32, width: '60%', alignSelf: 'center' },
});
