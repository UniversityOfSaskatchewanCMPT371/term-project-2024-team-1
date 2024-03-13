import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { ScreenStyles } from './Screen'
import DrawerButton from '../navigation/CustomDrawerButton'
import { Entypo } from '@expo/vector-icons'
import CreateSurveyQuestions from './CreateSurveyQuestions'
import KeyboardAvoidingContainer from './KeyboardAvoidContainer'


const CreateSurvey = ({ navigation }) => {

    const [surveyTitle, setSurveyTitle] = useState("")

    const [surveyQuestions, setSurveysQuestions] = useState([{ "index": 1, "questionName": "", "questionType": "checkBox", }])

    const [currentSurveyIndex, setCurrentSurveyIndex] = useState(0);
    const setQuestion = (questionInfo, index) => {

        let currentQuestions = { ...surveyQuestions }

        currentQuestions[index] = questionInfo

        setSurveysQuestions(currentQuestions);

    }
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#7f92f0" }}>

            <DrawerButton />


            <View style={{ flex: 0.5, paddingTop: 20, paddingBottom: 10 }}>
                <Text style={{ color: "#fff", fontSize: 20, textAlign: "center", fontWeight: "bold" }}>Admin</Text>
                <Text style={{ color: "#fff", fontSize: 30, textAlign: "center", fontWeight: "bold" }}>Create Survey</Text>
            </View>

            <View style={{ flex: 7, backgroundColor: "rgba(225,229,245,255)", width: "90%", marginTop: 30, borderRadius: 20, paddingTop: 10 }} >

                <View style={{ flex: 1.3, justifyContent: "flex-start", alignItems: "flex-end", paddingRight: 10 }}>
                    <TouchableOpacity
                        testID='PreviewButton'
                        onPress={() => {
                            console.log("Preview")
                        }}

                        style={{

                            width: 150,
                            padding: 5,
                            borderRadius: 10,
                            backgroundColor: "rgba(39,24,126,255)",
                            borderWidth: 4,

                        }}>
                        <Text style={{
                            color: "#ffffff",
                            fontSize: 15,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            textAlign: "center"



                        }}>
                            <Entypo name="check" size={10} color="white" />   Preview</Text>

                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center", paddingTop: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", width: "80%", borderWidth: 5, padding: 5, borderRadius: 5, borderColor: "rgba(64,51,142,255)" }}>

                        <View style={{ position: "absolute", top: -15, left: 10, padding: 5, backgroundColor: "white" }}>
                            <Text style={{ color: "rgba(151,144,184,255))", textAlign: "center" }}>SURVEY TITLE</Text>
                        </View>

                        <TextInput
                            style={{ height: 40, width: "90%", paddingLeft: 10 }}
                            placeholder="title for survey"
                            onChangeText={newText => setSurveyTitle(newText)}
                            value={surveyTitle}

                        />

                        <TouchableOpacity style={{ justifyContent: "center", width: "10%" }}
                            onPress={() => setSurveyTitle("")}>
                            <Entypo name={"circle-with-cross"} size={25} />
                        </TouchableOpacity>




                    </View>

                </View>



                <View style={{ flex: 10, height: "100%", width: "100%", alignItems: "center", }}>

                    <CreateSurveyQuestions setQuestion={setQuestion}/>

                </View>
                <View style={{ flex: 1.3, justifyContent: "center", width: "100%", alignItems: "center", paddingVertical: 10 }}>

                    <TouchableOpacity style={{ flex: 1, backgroundColor: "white", padding: 3, height: 20, width: 80, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, 0.4)", alignItems: "center", }}
                        onPress={() => console.log("Add")}>
                        <Text style={{ fontSize: 30, fontWeight: "bold", color: "black", textAlign: "center" }}>+</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <View style={{ flex: 1, paddingTop: 20, paddingBottom: 20, width: "100%", justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                    testID='DoneButton'
                    onPress={() => {
                        console.log("Done")
                    }}

                    style={{

                        width: "80%",
                        padding: 5,
                        borderRadius: 10,
                        backgroundColor: "rgba(30,196,176,255)",
                        borderWidth: 4,
                        borderColor: "rgba(104,147,180,255)"
                    }}>
                    <Text style={{
                        color: "#ffffff",
                        fontSize: 20,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        textAlign: "center"



                    }}>
                        <Entypo name="check" size={20} color="white" />   Done</Text>

                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CreateSurvey;