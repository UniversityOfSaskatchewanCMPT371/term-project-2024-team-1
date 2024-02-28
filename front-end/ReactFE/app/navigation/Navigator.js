import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import Survey from "../Screen/Survey"
import Profile from "../Screen/Profile"

import TestLoginScreen from "../../src/components/TestLoginScreen"

import { Dimensions } from "react-native";

import {Feather} from "@expo/vector-icons"
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AppStyles } from "../Styles/AppStyles";
import CustomDrawer from "./CustomDrawer"
const Drawer = createDrawerNavigator();


export default function Navigator() {
    return (
        <Drawer.Navigator testID={"drawer"} tabBarTestID={"drawer"} id={"drawer"}
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
        headerShown:false,
        drawerActiveTintColor:"#26177d",
        drawerLabelStyle:{
          color:"#111"
        }
        
        
        }
          
        }

        drawerContent={props=><CustomDrawer {...props}  />}


        
        initialRouteName="Home">
        <Drawer.Screen name ="Surveys" component={Survey} />
        <Drawer.Screen name ="Profile" component={Profile} />
        <Drawer.Screen name ="Login" component={TestLoginScreen} />
        
        </Drawer.Navigator>
    );
  }



  /*headerStyle:{
          backgroundColor:"#5d6ebe",
        },
         headerTintColor:"#fff",
         headerTitleStyle:{
          fontWeight:"bold"
         },

         */