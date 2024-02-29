import {View, Text} from 'react-native'
import React from 'react'
import { ScreenStyles } from './Screen'
import DrawerButton from '../navigation/CustomDrawerButton'
export default function TestScreen() {

    return (
        <View style={[ScreenStyles.ScreenStyle, {justifyContent:"start", paddingTop:40}]}>
        <DrawerButton/>
        <Text style={{color:"#fff", fontSize:50, fontWeight:"bold"}}>CASI</Text>
        <View style={{marginTop:"50%"}} >

            <Text style={{color:"#fff", fontWeight:"bold", fontSize:30, marginBottom:30}}>TESTING SCREEN</Text> 
            
            
        
        </View>
        </View>
    )
}