
import React from "react";
import LoginScreen from "./src/components/TestLoginScreen";
import Index from "./app/index";
import SignUp from "./app/Screen/SignUp";
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


*/
const App = () => {
  return <SignUp id={'welcome'}/>;
};

export default App;