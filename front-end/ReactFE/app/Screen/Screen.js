
import { StyleSheet,TouchableOpacity, Text, Button, View,SafeAreaView } from 'react-native';
import TestButton from '../testButton';
import { useReducer } from 'react';
import {FontAwesome} from "@expo/vector-icons"

const Screen = () => {

    //const router = userRouter();
    return (
        <View style={[styles.CasiBlue,styles.container]}>
        <SafeAreaView style={{flex: 1}} className={"CasiBlue"}>
        <TouchableOpacity 
        onPress={this.props.navigation.openDrawer}
        style={{alignItems:"flex-end",margin:16}}>

            <FontAwesome name="bars" size={24} color="#18192" />
        </TouchableOpacity>
           <View style={{flex:1, alignItems:"center",justifyContent:"center"}}>
                <Text style={styles.text}>{this.props.screenName} Screen</Text>
           </View>
        </SafeAreaView>
        </View>
    )
}
const styles = StyleSheet.create({
    /* Colors */

container: {
    flex:1,
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
    backgroundColor: "#26177d",
}
});
export default Screen;