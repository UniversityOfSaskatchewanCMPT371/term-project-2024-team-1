import {View, Text, ImageComponent, useWindowDimensions} from 'react-native'
import React from 'react'
import { ScreenStyles } from './Screen'
import { useNavigation } from '@react-navigation/native'

import { StyleSheet } from 'react-native'


export default function SurveyModal( {navigation,item}) {


   

      const {width,height} =  useWindowDimensions();

    return (

        <View style={[styles.container,{flex:1,width:width}]}>
        
            <View style={{flex:0.7}}>
            <Text style={{color:"#fff", fontWeight:"bold", fontSize:30, marginBottom:30,textAlign:"center"}}>{item.title}</Text> 
          

            </View>

            <Text style={{flex:0.3}}>Footer</Text>
         
            
            
           
     
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
})