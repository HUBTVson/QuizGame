import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.54:5000/api';
const TOKEN_KEY = 'auth_token';

export const saveAuthToken = (token) => AsyncStorage.setItem(TOKEN_KEY, token);
export const clearAuthToken = () => AsyncStorage.removeItem(TOKEN_KEY);

const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerUser = async (username, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
    return response.json();
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

export const createQuiz = async (title, section, questions) => {
    const response = await fetch(`${API_URL}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, section, questions }),
    });
    return response.json();
};

export const getQuizzData = async () => {
    const fetchPromise = fetch(`${API_URL}/quizzes`).then(r => r.json());
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 5000)
    );
    return Promise.race([fetchPromise, timeoutPromise]);
};

export const saveScore = async (userId, quizId, score) => {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_URL}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ userId, quizId, score }),
    });
    return response.json();
};

export const deleteMyScores = async (userId) => {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_URL}/scores/user/${userId}`, {
        method: 'DELETE',
        headers: { ...authHeader },
    });
    return response.json();
};

export const getLeaderboard = async (quizId) => {
    const query = quizId ? `?quizId=${quizId}` : '';
    const response = await fetch(`${API_URL}/scores/leaderboard${query}`);
    return response.json();
};

export const getUserLocation = async () => {
    // user permission for recording
    const {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        throw new Error('Location permission denied')
    }

    // download coordinates
    const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
    });

    // change coordinates for city names (reverse geocoding via BigDataCloud)
    const { latitude, longitude } = location.coords;
    const geoRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const geoData = await geoRes.json();
    const city = geoData.city || geoData.locality || geoData.principalSubdivision;
    const country = geoData.countryName;

    return {
        city,
        country,
        display: `${city}, ${country}`,
        latitude,
        longitude,
    };
};

