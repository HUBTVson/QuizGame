import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegisterScreen from '../screens/Login';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Stack.Navigator>
            {/* Set Quiz as the primary view for testing */}
            <Stack.Screen name="Quiz Game" component={QuizScreen}/>
        </Stack.Navigator>
    );
}