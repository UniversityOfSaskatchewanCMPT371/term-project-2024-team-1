import "react-native-gesture-handler";




import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import Navigator from "./navigation/Navigator"
import { AppStyles } from './Styles/AppStyles';

import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Survey from "./Screen/Survey";
import Profile from "./Screen/Profile";
import IDRequests from "./Screen/IDRequests";
import Users from "./Screen/Users";


export default function Index() {
  
  return (

    <NavigationContainer style={AppStyles.CasiBlue}>
     <Navigator/>
    </NavigationContainer>
  );
}
