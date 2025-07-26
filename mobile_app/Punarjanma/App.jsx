import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import Profile from './src/screens/Profile';
import Courses from './src/screens/Courses';
import AI from './src/screens/AI';
import SplashScreen from './src/screens/SplashScreen.jsx'; // ✅ Import SplashScreen
import LoginScreen from './src/screens/LoginScreen.jsx';
import SignupScreen from './src/screens/SignupScreen.jsx';
import OtpScreen from './src/screens/OtpScreen.jsx';
import ChatbotScreen from './src/screens/ChatbotScreen.jsx';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash" 
        // initialRouteName="otp" 
        
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="otp" component={OtpScreen} />

        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Courses" component={Courses} />
        <Stack.Screen name="AI" component={AI} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
