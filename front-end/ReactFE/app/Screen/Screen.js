
import { StyleSheet,TouchableOpacity, Text, Button, View,SafeAreaView } from 'react-native';
import TestButton from '../testButton';
import { useReducer } from 'react';
import {FontAwesome} from "@expo/vector-icons"

const Screen = () => {

    //const router = userRouter();
    return (
        <View style={[ScreenStyles.CasiBlue,ScreenStyles.container]}>
        <SafeAreaView style={{flex: 1}} className={"CasiBlue"}>
        <TouchableOpacity 
        onPress={this.props.navigation.openDrawer}
        style={{alignItems:"flex-end",margin:16}}>

            <FontAwesome name="bars" size={24} color="#18192" />
        </TouchableOpacity>
           <View style={{flex:1, alignItems:"center",justifyContent:"center"}}>
                <Text style={ScreenStyles.text}>{this.props.screenName} Screen</Text>
           </View>
        </SafeAreaView>
        </View>
    )
}
export const ScreenStyles = StyleSheet.create({
    /* Colors */

container: {
    flex:1,
    justifyContent:"center",
    alignItems:"center"
},
text:{
    color: "#161924",
    fontSize:20,
    fontWeight:"500"
},
CasiBlue: {
    backgroundColor: "#7f92f0"
}, 



CasiDarkBlue: {
 backgroundColor: "#5d6ebe" 
},

CasiPurple: {
    backgroundColor: "#25177B",
},
button: {
    fontSize:30,
    color:"#ffffff",
    padding:15,
    borderRadius:30,
},
buttonText:{
    color:"#ffffff",
    fontSize:30,
    padding:10,
    borderRadius:30,
},

ScreenStyle:{
    flex:1, alignItems:"center", justifyContent:"center", backgroundColor:"#7f92f0"}
});
export default Screen;