const API_URL = 'http://192.168.0.54:5000/api'

export const registerUser = async (username, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
    return response.json();
};

export const getQuizzData = async () => {
    try {
        const response = await fetch(`${API_URL}/quiz`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching quizz:", error);
        throw error;
    }
};

