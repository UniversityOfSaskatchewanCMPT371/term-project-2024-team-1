
// import { StyleSheet, Text, View } from 'react-native';
import React from "react";
import Index from "./app/index";
import { SafeAreaView } from "react-native";
import { AuthProvider } from "./app/context/AuthContext";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from 'expo-splash-screen';
const App = () => {
  return <AuthProvider>
    
<<<<<<< HEAD
    <Index id={'welcome'}/>
    <StatusBar style="light" hidden={false} translucent={false} />
=======
    <SafeAreaView style={{flex:1}}>
    <Index id={'welcome'}/>
    </SafeAreaView>
    <StatusBar style="default"  hidden={false} translucent={false}showHideTransition={false} barStyle={"rgba(127, 17, 224, 1)"} />
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667
  </AuthProvider>;
};

export default App;