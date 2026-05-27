import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/Login';
import HomeScreen from '../screens/Home';
import QuizScreen from '../screens/Quiz';
import StatisticsScreen from '../screens/Statistics';
import { getUserLocation } from '../services/api';

const Stack = createNativeStackNavigator();

export default function App() {
    const [city, setCity] = useState(null);

    useEffect(() => {
        async function fetchLocation() {
            try {
                const location = await getUserLocation();
                setCity(location.display);
            } catch (e) {
                setCity('Unknown location');
            }
        }
        fetchLocation();
    }, []);

    return (
        <Stack.Navigator initialRouteName="Register">
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: 'Create Account' }}
            />
            <Stack.Screen
                name="Home"
                options={{ title: city || 'Home', headerBackVisible: false }}
            >
                {props => <HomeScreen {...props} city={city} />}
            </Stack.Screen>
            <Stack.Screen
                name="Quiz"
                component={QuizScreen}
                options={{ title: 'Quiz Game' }}
            />
            <Stack.Screen
                name="Statistics"
                component={StatisticsScreen}
                options={{ title: 'Statistics' }}
            />
        </Stack.Navigator>
    );
}