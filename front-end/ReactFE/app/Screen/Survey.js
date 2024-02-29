import {View, Text, Button,TouchableOpacity} from 'react-native'
import React from 'react'
import { ScreenStyles } from './Screen'
import { useNavigation } from '@react-navigation/native'
import DrawerButton from '../navigation/CustomDrawerButton'
export default function Survey( {navigation}) {


   

      

    return (

        <View style={[ScreenStyles.ScreenStyle, {justifyContent:"start", paddingTop:40}]}>
        
            <DrawerButton/>
      
       
        <Text style={{color:"#fff", fontSize:50, fontWeight:"bold"}}>CASI</Text>
        <View style={{marginTop:"50%"}} >

            <Text style={{color:"#fff", fontWeight:"bold", fontSize:30, marginBottom:30,textAlign:"center"}}>SURVEY TEST</Text> 
          
            
            <TouchableOpacity onPress={()=>{navigation.navigate("TestScreen")}}  style={[ScreenStyles.CasiPurple,ScreenStyles.button]}>
              <Text style={ScreenStyles.buttonText}> Take Survey </Text> 
              
              </TouchableOpacity>
           
        </View>
        </View>
    )
}