
import { StyleSheet, TouchableOpacity, Text,View,TextInput } from 'react-native';
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';
const CreateSurveyQuestions = ({setQuestion}) => {

    const [questionName,setQuestionName] = useState("")
    const [questions,setQuestions] = useState([])






    return (
        <View style={styles.container}>
            
                    {/*survey input*/}
                    <View style={{ flex: 1.5, marginVertical: 20, borderRadius: 10, flexDirection: "row", width: "90%", padding: 0, justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1 }}>
                        <TextInput
                            style={{ paddingLeft: 10, height: 40, width: "70%" }}
                            placeholder="title for survey"
                            onChangeText={newText => setQuestionName(newText)}
                            value={questionName}

                        />

                        {/*dropDown */}
                        <TouchableOpacity style={{ justifyContent: "center", width: "30%", backgroundColor: "rgba(95,111,192,255)", padding: 0, height: "100%", borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
                            onPress={() => console.log("dropdown")}>
                            <Text style={{ color: "white", textAlign: "center" }}>CheckBox</Text>
                        </TouchableOpacity>

                    </View>

                    {/*Inner blue box*/}
                    <View style={{ flex: 8, height: "100%", width: "90%", borderRadius: 10, backgroundColor: "rgba(128,147,241,255)", alignItems: 'center', justifyContent: "center" }}>

                        <View style={{ flex: 9 }}>

                        </View>
                        <View style={{ flex: 1.2, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, width: "100%", paddingBottom: 10 }}>
                            <View >
                                <TouchableOpacity style={{ justifyContent: "center", backgroundColor: "rgba(201,194,194,255)", padding: 5, height: "100%", width: 80, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, .40)", }}
                                    onPress={() => console.log("cancel")}>
                                    <Text style={{ fontSize: 15, color: "white", textAlign: "center" }}>CANCEL</Text>
                                </TouchableOpacity>
                            </View>
                            <View >

                                <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", backgroundColor: "rgba(30,196,176,255)", padding: 3, height: "100%", width: 80, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, 0.4)" }}
                                    onPress={() => console.log("Done")}>
                                    <Text style={{ fontSize: 15, color: "white", textAlign: "center" }}>DONE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

        </View>

    )
}
const styles = StyleSheet.create({
    /* Colors */

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        color: "#161924",
        fontSize: 20,
        fontWeight: "500"
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
        fontSize: 30,
        color: "#ffffff",
        padding: 15,
        borderRadius: 30,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 30,
        padding: 10,
        borderRadius: 30,
    },

    ScreenStyle: {
        flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#7f92f0"
    },

    modal: {
        borderRadius: 10,
        backgroundColor: "#ffffff",


    }
});
export default CreateSurveyQuestions;