import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import Survey from "../Screen/Survey"
import Profile from "../Screen/Profile"
import {createStackNavigator} from "@react-navigation/stack"
import TestLoginScreen from "../../src/components/TestLoginScreen"

import TestScreen from "../Screen/TEST"
import CustomDrawer from "./CustomDrawer"
const Drawer = createDrawerNavigator();


const SurveyStack = () => {
    return (
      <AppStack.Navigator screenOptions={{
        headerShown: false
      }} initialRouteName="Survey">
      <AppStack.Screen name="SurveyScreen" component={Survey}/>
      <AppStack.Screen name="TestScreen" component={TestScreen} />
    </AppStack.Navigator>
       
    );
  }

  const AppStack = createStackNavigator();

const Navigator = () => {
  return(
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
        <Drawer.Screen name ="Survey" testID={"survID"} component={SurveyStack} />
        <Drawer.Screen name ="Profile" testID={"profileID"} component={Profile} />
        <Drawer.Screen name ="Login" component={TestLoginScreen} />
        
        </Drawer.Navigator>
  );
}

export default Navigator


  /*headerStyle:{
          backgroundColor:"#5d6ebe",
        },
         headerTintColor:"#fff",
         headerTitleStyle:{
          fontWeight:"bold"
         },

         */