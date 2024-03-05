import 'react-native-gesture-handler';

import { Dimensions } from "react-native";

import {Feather} from "@expo/vector-icons"


import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import Survey from './Screen/Survey'


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './Screen/Login';
import { useAuth } from './context/AuthContext';

export default function Index() {
  const {authState, onLogout} = useAuth();
  return (
    <NavigationContainer style={styles.CasiBlue}>     
      <Stack.Navigator
        screenOptions={{
          drawerStyle:{
            backgroundColor: "#7f92f0"
          },
          screenOptions:{
            backgroundColor: "black" ,
            fontSize:"2em",
            
            width:250,
          },
          cardStyle: {
            backgroundColor: '#7f92f0',
         },
        headerStyle:{
          backgroundColor:"#5d6ebe",
        },
         headerTintColor:"#fff",
         headerTitleStyle:{
          fontWeight:"bold"
         },
        drawerActiveTintColor:"#26177d",
        drawerLabelStyle:{
          color:"#111"
        }}}
      
      initialRouteName="Home">
        { authState?.token ? 
          <Stack.Screen name ="Survey" component={Survey} />: 
          <Stack.Screen name ="Login" component={Login} />
        }
       
       
       {/* <Stack.Screen name ="Profile" component={Profile} /> */}
        
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({


container: {
  flex:1,
},
text:{
  color: "#161924",
  fontSize:20,
  fontWeight:"500"
},
CasiBlue: {
  backgroundColor: "#7f92f0"
}, 



CasiDarkBlue: {
backgroundColor: "#5d6ebe" 
},

CasiPurple: {
  backgroundColor: "#26177d",
}
});
