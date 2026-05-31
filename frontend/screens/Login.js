import React, {useState} from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { registerUser, loginUser } from '../services/api';

export default function RegisterScreen({ navigation }) {
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert("Error", "All fields are required!");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Alert.alert("Error", "Enter a valid email address.");
            return;
        }
        if (password.length < 8) {
            Alert.alert("Error", "Password must be at least 8 characters.");
            return;
        }
        try {
            const data = await registerUser(username, email, password);
            if (data.message === 'User registered successfully.') {
                Alert.alert("Success", data.message, [
                    { text: 'OK', onPress: () => navigation.navigate('Home', { username, userId: data.userId }) }
                ]);
            } else {
                Alert.alert("Error", data.message);
            }
        } catch (error) {
            Alert.alert("Error", "Could not connect to server.");
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Email and password are required!");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Alert.alert("Error", "Enter a valid email address.");
            return;
        }
        try {
            const data = await loginUser(email, password);
            if (data.username) {
                navigation.navigate('Home', { username: data.username, userId: data.userId });
            } else {
                Alert.alert("Error", data.message);
            }
        } catch (error) {
            Alert.alert("Error", "Could not connect to server.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

            {!isLogin && (
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
            />

            <View style={styles.button}>
                <Button
                    title={isLogin ? 'Login' : 'Register'}
                    onPress={isLogin ? handleLogin : handleRegister}
                    color="#2196F3"
                />
            </View>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.toggle}>
                    {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
    button: { marginTop: 10, marginBottom: 20 },
    toggle: { textAlign: 'center', color: '#2196F3', fontSize: 15 },
});
