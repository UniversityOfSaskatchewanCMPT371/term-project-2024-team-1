import {View, Text, ImageComponent, useWindowDimensions} from 'react-native'
import React from 'react'
import { ScreenStyles } from './Screen'
import { useNavigation } from '@react-navigation/native'
import Paginator from '../navigation/Paginator'
import { StyleSheet } from 'react-native'


export default function SurveyModal( {navigation,item,scrollx,data}) {


   

      const {width,height} =  useWindowDimensions();

    return (

        <View style={[styles.container,{ width:width-20}]}>
        
            <View style={[{flex:1}]}>
            <Text style={{color:"#000", fontWeight:"bold", fontSize:30, marginBottom:30,textAlign:"center"}}>{item.title}</Text> 
          

            </View>
            
           
        
     
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
       flex:1,
       width:"100%",
        justifyContent:"center",
        alignItems:"center"
    },
   
})