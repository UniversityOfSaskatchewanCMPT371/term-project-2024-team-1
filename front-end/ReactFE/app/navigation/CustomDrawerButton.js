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
      position: 'absolute', // Absolute positioning relative to the parent container
      top: 0, // Align the TouchableOpacity to the top of the parent container
      left: 0, // Align the TouchableOpacity to the left of the parent container
      padding: 10,
      zIndex:1000}}>
        
    <TouchableOpacity onPress={openDrawer} >
      <Entypo name="menu" size={30} color="white" />
    </TouchableOpacity>
    </View>
  );
};

export default DrawerButton;