
// import { StyleSheet, Text, View } from 'react-native';
import React from "react";
import Index from "./app/index";
import { View,Text } from "react-native";
import { AuthProvider } from "./app/context/AuthContext";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from 'expo-splash-screen';
const App = () => {
  return <AuthProvider>
    
    <Index id={'welcome'}/>
    <StatusBar style="light" hidden={false} translucent={false} />
  </AuthProvider>;
};

export default App;