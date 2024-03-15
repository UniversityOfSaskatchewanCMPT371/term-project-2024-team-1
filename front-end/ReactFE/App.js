// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import React from "react";
import Index from "./app/index";
import { View,Text } from "react-native";
import { AuthProvider } from "./app/context/AuthContext";

const App = () => {
  return <AuthProvider>
    <Index id={'welcome'}/>
  </AuthProvider>;
};

export default App;