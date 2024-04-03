import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./navigation/Navigator"
import { AppStyles } from './Styles/AppStyles';
import registerNNPushToken from 'native-notify';
import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "./Screen/Profile";
import IDRequests from "./Screen/IDRequests";
import Users from "./Screen/Users";

export default function Index() {
  registerNNPushToken(20557, 'FEPQ2armb5vEv4HoIDpm8x');
  return (
    <NavigationContainer style={AppStyles.CasiBlue} gestureEnabled = {false}>
      <Navigator />
    </NavigationContainer>
  );
}
