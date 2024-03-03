// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import React from "react";
import LoginScreen from "./src/components/TestLoginScreen";
import Index from "./app/index";
import { View,Text } from "react-native";
import { AuthProvider } from "./app/context/AuthContext";
/*
export default function App() {
  return (
    <View style={styles.container}>
      <Text>TTTTTEST222222</Text>
      <StatusBar style="auto" />
    </View>
  );
}


*/
const App = () => {
  return <AuthProvider>
    <Index id={'welcome'}/>
  </AuthProvider>;
};

export default App;