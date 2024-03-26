import React from "react";
import { SafeAreaView,KeyboardAvoidingView,Platform,ScrollView } from "react-native";


const KeyboardAvoidingContainer = ({children}) => {


    return (
        <SafeAreaView style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#7f92f0"}}>
            
            <KeyboardAvoidingView style={{flex:1,width:"100%",height:"100%",alignItems: "center", justifyContent: "center",}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
         
         <ScrollView contentContainerStyle={{flexGrow:1}}>
            {children}
        </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default KeyboardAvoidingContainer