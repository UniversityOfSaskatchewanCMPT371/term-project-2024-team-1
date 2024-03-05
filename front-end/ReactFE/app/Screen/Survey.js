import { View, Text, Button } from 'react-native'
import React from 'react'
import { ScreenStyles } from './Screen'
import axios from 'axios'; // Add this line to import axios
import { API_URL, useAuth } from '../context/AuthContext';

export default function Survey() {

    const {onLogout} = useAuth();

    const IPV4_ADDRESS = "10.0.0.15";
    const API_URL = `http://${IPV4_ADDRESS}:3000/api/users`;

    const handleLogout = async () => {
        try {
            await onLogout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
    
    // THIS IS A TEST FUNCTION 
    const handleGetAll = async () =>{
        try{
            axios.get(API_URL)
            .then(async (response) => {
                const result = response.data;
                console.log(result);
            })
            .catch(async error => {
                alert(error.response.data)
                console.error(error.response.status +": "+ error.response.data);
                if(error.response.status == 401){
                    await onLogout();
                }
                    
            });
        } catch{
            console.log("ERROR")
        }
    }

    return (
        <View style={[ScreenStyles.ScreenStyle, { justifyContent: "start", paddingTop: 40 }]}>
            <Text style={{ color: "#fff", fontSize: 50, fontWeight: "bold" }}>CASI</Text>
            <View style={{ marginTop: "50%" }} >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 30, marginBottom: 30 }}>SURVEY TEST</Text>
                <Button
                    color="#25177B"
                    style={[ScreenStyles.CasiPurple, ScreenStyles.button]}
                    title="Take Survey"
                />
                <Button
                    color="#ff0000"
                    title="Logout"
                    onPress={handleLogout}
                />
                
                <Button
                    color="#ff0000"
                    title="Get All User"
                    onPress={handleGetAll}
                />
            </View>
        </View>
    )
}
