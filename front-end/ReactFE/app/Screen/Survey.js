import {View, Text, Button} from 'react-native'
import React from 'react'
import { ScreenStyles } from './Screen'

export default function Survey() {

    return (

        <View style={[ScreenStyles.ScreenStyle, {justifyContent:"start", paddingTop:40}]}>
        <Text style={{color:"#fff", fontSize:50, fontWeight:"bold"}}>CASI</Text>
        <View style={{marginTop:"50%"}} >

            <Text style={{color:"#fff", fontWeight:"bold", fontSize:30, marginBottom:30}}>SURVEY TEST</Text> 
            <Button color="#25177B" style={[ScreenStyles.CasiPurple,ScreenStyles.button]}
            title="Take Survey"/>
        
        </View>
        </View>
    )
}