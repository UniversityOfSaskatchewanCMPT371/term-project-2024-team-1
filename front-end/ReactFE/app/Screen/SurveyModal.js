import {View, Text, ImageComponent, useWindowDimensions, TextInput} from 'react-native'
import React, {useState} from 'react'
import {ScreenStyles} from './Screen'
import {useNavigation} from '@react-navigation/native'
import Paginator from '../navigation/Paginator'
import {StyleSheet} from 'react-native'
import {CheckBox} from 'react-native-elements';

export default function SurveyModal({navigation, item, scrollx}) {

    let {width, height} = useWindowDimensions();
    width -=20;
    const [result,
        setResult] = useState({"encountered": false, "number": 0, "frequency": 0})
    const [isChecked,
        setIsChecked] = useState(false);
    const setEncounter = (val) => {

        setResult({
            ...result,
            "encountered": val
        })
        setIsChecked(val)
        console.log(result);
    }

    const setNumber = (val) => {
        setResult({
            ...result,
            "number": parseInt(val)
        })
    }

    const setFrequency = (val) => {
        setResult({
            ...result,
            "frequency": parseInt(val)
        })
    }

    return (

        <View
            testID={item.id}
            style={[
            styles.container, {
                width: width ,
                paddingHorizontal: 20
            }
        ]}>

            <View
                style={[{
                    flex: 1,
                    marginTop: 10,
                    alignItems: 'flex-start'
                }
            ]}>
                <Text
                    style={{
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: 30,
                    marginBottom: 30,
                    textAlign: "left"
                }}>{item.title}</Text>

            </View>

            <View
                style={{
                flex: 2,
                justifyContent: "flex-start",
                alignItems: "center"
            }}>
                <Text
                    style={{
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: 20,
                    marginBottom: 30,
                    textAlign: "center"
                }}>{item.questionHeader}</Text>

            </View>

            <View
                style={{
                flex: 4,
                justifyContent: "space-around"
            }}>

                <View style={{
                    flex: 1
                }}>
                    <CheckBox
                        checked={result.encountered}
                        checkedColor="#0F0"
                        containerStyle={{
                        width: "75%"
                    }}
                        iconRight
                        onIconPress={() => setEncounter(!result.encountered)}
                        onPress={() => console.log("onPress()")}
                        size={30}
                        textStyle={{}}
                        title="Was the disease encountered?"
                        titleProps={{}}
                        uncheckedColor="#00F"/>
                </View>

                {isChecked && <View style={{
                    flex: 1
                }}>
                    <Text style={{}}>How many cases were encountered</Text>
                    <TextInput
                        style={{
                        borderWidth: 3,
                        padding: 5,
                        width: width*0.8,
                        height: 40
                    }}
                        keyboardType='numeric'
                        onChangeText={(num) => setNumber(num)}/>
                </View>
}

                {isChecked && <View style={{
                    flex: 1
                }}>
                    <Text style={{}}>What is the frequency compared to last year</Text>
                    <TextInput
                        style={{
                        borderWidth: 3,
                        padding: 5,
                        width: width*0.8,
                        height: 40
                    }}
                        keyboardType='numeric'
                        onChangeText={(num) => setFrequency(num)}/>
                </View>
}
            </View>

        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "stretch"
    }
})