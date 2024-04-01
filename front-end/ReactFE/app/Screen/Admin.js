import {View, Text, Button} from 'react-native'
import React from 'react'
import { ScreenStyles } from './Screen'
import DrawerButton from '../navigation/CustomDrawerButton'
import axios from 'axios'; 
import { useAuth } from '../context/AuthContext';


export default function Admin({navigation}) {

    const {onLogout} = useAuth();


    const handleLogout = async () => {
        try {
            await onLogout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    return (
        <View style={[ScreenStyles.ScreenStyle, {justifyContent:"start", paddingTop:40}]}>
                <DrawerButton/>
        <Text style={{color:"#fff", fontSize:50, fontWeight:"bold"}}>ADMIN DADSHBOARD</Text>
        <View style={{marginTop:"50%"}} >

            <Text style={{color:"#fff", fontWeight:"bold", fontSize:30, marginBottom:30}}>user is admin</Text> 
            <TouchableOpacity
          style={[ScreenStyles.CasiTeal, ScreenStyles.button]}
          onPress={() => {
            console.log("Create Survey Pressed");
          }}
        >
          <Text style={ScreenStyles.buttonText}>+ Create Survey</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ScreenStyles.CasiPurple, ScreenStyles.button]}
          onPress={() => {
            console.log("Download Results Pressed");
          }}
        >
          <Text style={ScreenStyles.buttonText}>Download Results</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ScreenStyles.CasiPurple, ScreenStyles.button]}
          onPress={() => {
            console.log("ID Requests Pressed");
          }}
        >
          <Text style={ScreenStyles.buttonText}>ID Requests</Text>
        </TouchableOpacity>
            <Button
                    color="#ff0000"
                    title="Logout"
                    onPress={handleLogout}
            />
        </View>
        </View>
    )
}