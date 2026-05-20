import React, {useState} from 'react';
import { View, Text, TextInput, Button, Alert} from 'react-native';
import {registerUser} from '../services/api';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        // user input validation
        if (!username || !email || !password) {
            Alert.alert("Error", "All fields are required!");
            return;
        }
        if (password.length < 8) {
            Alert.alert("Error", "Password must be at least of 8 characters.");
            return;
        }
        // send user input to backend
        try {
            const data = await registerUser(username, email, password);
            Alert.alert("Success", data.message);
        } catch (error) {
            Alert.alert("Error", "Could not connect to server.");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Register</Text>
            <TextInput placeholder="Username" onChangeText={setUsername}/>
            <TextInput placeholder="Email" onChangeText={setEmail}/>
            <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword}/>
            <Button title="Submit" onPress={handleRegister}/>
        </View>
    );
}