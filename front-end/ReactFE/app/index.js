import 'react-native-gesture-handler';




import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import Navigator from "./navigation/Navigator"


import { useAuth } from './context/AuthContext';

export default function Index() {
  const {authState} = useAuth();
  return (

    <NavigationContainer style={AppStyles.CasiBlue}>
     <Navigator/>
   
    

    </NavigationContainer>
  );
}
