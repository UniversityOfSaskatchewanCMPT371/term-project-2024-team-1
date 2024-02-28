import 'react-native-gesture-handler';

import { Dimensions } from "react-native";

import {Feather} from "@expo/vector-icons"


import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from "./navigation/Navigator"
import { AppStyles } from './Styles/AppStyles';

const Drawer = createDrawerNavigator();



export default function Index() {
  return (
    <NavigationContainer style={AppStyles.CasiBlue}>
     <Navigator/>
    </NavigationContainer>
  );
}
