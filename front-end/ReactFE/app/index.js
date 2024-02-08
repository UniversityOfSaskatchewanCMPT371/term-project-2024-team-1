import 'react-native-gesture-handler';

import { Dimensions } from "react-native";

import {Feather} from "@expo/vector-icons"


import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Survey from './Screen/Survey'
import Profile from './Screen/Profile';


const Drawer = createDrawerNavigator();
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

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
export default function Index() {
  return (
    <NavigationContainer style={styles.CasiBlue}>
      <Drawer.Navigator
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
        }
          
        }
      
      initialRouteName="Home">
       <Drawer.Screen name ="Survey" component={Survey} />
       <Drawer.Screen name ="Profile" component={Profile} />
        
      </Drawer.Navigator>
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
