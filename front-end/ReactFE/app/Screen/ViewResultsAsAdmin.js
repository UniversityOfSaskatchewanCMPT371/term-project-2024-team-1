import React from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import DrawerButton from '../navigation/CustomDrawerButton';
import { ScreenStyles } from './Screen';
import { BottomSheet } from 'react-native-elements';


export default function Admin() {


    const handleDownloadButton = async (id) => {
        try {
            console.log('Download Button clicked', {id})
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    const handleRemindButton = async (id) => {
        try {
            console.log("remind", {id})
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }


    const styles = StyleSheet.create({
        container: {
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 300,
          height: 100, 
          backgroundColor: '#e0e0e0', 
          padding: 10,
          paddingTop: 20,
          borderRadius: 10, 
          marginBottom: 20,
        },
        buttonContainer: {
            flexDirection: 'row'
        },
        button: {
          backgroundColor: '#1EC4B0',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 7,
          height: 30,
          margin: 3,
          borderColor: '#000000',
          borderWidth: 0.5,
          
        },
        buttonText: {
          color: '#ffffff',
          fontSize: 14,
        },
        Text: {
            fontSize: 24
        }
      });

      const surveyResultContainer = ({ id, onDownloadPress, onRemindPress }) => (
        <View style={styles.container} id={id}>
            <Text style={styles.Text}>Quarter {id} Survey</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        onDownloadPress(id); 
                    }}>
                    <Text style={styles.buttonText}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        onRemindPress(id); 
                    }}>
                    <Text style={styles.buttonText}>Remind Users</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    

    return (
        <View style={[ScreenStyles.ScreenStyle, {justifyContent:"start", paddingTop:40}]}>
            <DrawerButton/>
        <Text style={{color:"#fff", fontSize:40, fontWeight:"bold"}}>ADMIN</Text>
        <Text style={{color:"#fff", fontSize:30, fontWeight:"bold"}}>Survey Results</Text>
        <View style={{marginTop:"10%"}} >
            

        <View >
        {surveyResultContainer({id:"1", onDownloadPress: handleDownloadButton, onRemindPress: handleRemindButton})}
        </View>

        <View >
        {surveyResultContainer({id:"2", onDownloadPress: handleDownloadButton, onRemindPress: handleRemindButton})}
        </View>

        <View >
        {surveyResultContainer({id:"3", onDownloadPress: handleDownloadButton, onRemindPress: handleRemindButton})}
        </View>

        <View >
        {surveyResultContainer({id:"4", onDownloadPress: handleDownloadButton, onRemindPress: handleRemindButton})}
        </View>
        

        </View>
        </View>
    )
}