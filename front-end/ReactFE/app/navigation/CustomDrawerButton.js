import React from 'react';
import {View, TouchableOpacity} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
const DrawerButton = ( ) => {
 
    
  const navigation = useNavigation();
      
 
  const openDrawer = () => {
    navigation.toggleDrawer();
  };

  return (
    <View testID='menuButton' style={ {
      position: 'absolute', 
      top: 0, 
      left: 0, 
      padding: 10,
      zIndex:1000}}>
        
    <TouchableOpacity onPress={openDrawer} >
      <Entypo name="menu" size={40} color="white" />
    </TouchableOpacity>
    </View>
  );
};

export default DrawerButton;