import 'react-native-gesture-handler';




import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import Navigator from "./navigation/Navigator"
import { AppStyles } from './Styles/AppStyles';



export default function Index() {
  
  return (

    <NavigationContainer style={AppStyles.CasiBlue}>
     <Navigator/>
   
    

    </NavigationContainer>
  );
}
