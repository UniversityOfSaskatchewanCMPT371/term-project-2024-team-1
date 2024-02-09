// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import React from "react";
import LoginScreen from "./src/components/TestLoginScreen";
import Index from "./app/index";
import { View,Text } from "react-native";
/*
export default function App() {
  return (
    <View style={styles.container}>
      <Text>TTTTTEST222222</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/
const App = () => {
  return <Index id={'welcome'}/>;
};

export default App;