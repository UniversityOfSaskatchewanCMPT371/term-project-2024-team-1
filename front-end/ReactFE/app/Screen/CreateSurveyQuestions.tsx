
import { StyleSheet, TouchableOpacity, Text, View, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { CheckBox } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
const CreateSurveyQuestions = (props) => {

    const [questionName, setQuestionName] = useState("")
    const [MCQuestions, setMCQuestions] = useState([])
    const [isChecked, setIsChecked] = useState(false);
    const [questionType, setQuestionType] = useState("Written Answer")
    const [isFocus, setIsFocus] = useState(false);



    const questionTypes = [
        { value: 'Check Box', label: 'Check Box' },
        { value: 'Multiple Choice', label: 'Multiple Choice' },
        { value: 'Written Answer', label: 'Written Answer' },

    ]

    const triggerDone = () =>{
        let question = { ...props.questions[props.index] }
        question["questionName"] = questionName;
        question["type"] = questionType

        props.triggerDone(question,props.index);
    }
    const triggerQuestionChange = () => {

        let question = { ...props.questions[props.index] }
        question["questionName"] = questionName;
        question["type"] = questionType

        props.setQuestion(question, props.index);
    }
    const triggerQuestionChangeAdd = () => {
        let question = { ...props.questions[props.index] }
        question["questionName"] = questionName;
        question["type"] = questionType


        props.setQuestionAdd(question, props.index);
    }

    const triggerQuestionChangeAddDerived = () => {
        let question = { ...props.questions[props.index] }
        question["questionName"] = questionName;
        question["type"] = questionType
        question["derived"] += 1 


        props.setQuestionAddDerived(question, props.index);
    }

    const setDefaultValues = (type="Written Answer", name="") =>{


        setQuestionType(type);
        setQuestionName(name);
    }


    const switchQuestion = (index) => {
        /*maybe needs to be optimized*/
        triggerQuestionChange();
        const newQuestion = props.questions[index];
        setQuestionType(newQuestion.type);
        setQuestionName(newQuestion.questionName);


    }
    props.childRef.current = {
        triggerQuestionChange: triggerQuestionChange,
        triggerQuestionChangeAdd: triggerQuestionChangeAdd,
        switchQuestion: switchQuestion,
        setDefaultValues:setDefaultValues,
        triggerDone:triggerDone
    };

    return (
        <View style={[styles.container, { width: "100%" }]}>

            {/*survey input*/}
            <View style={{ flex: 1, marginVertical: 20, borderRadius: 10, width: "80%", padding: 0, justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1 }}>

                {/*dropDown */}


                <TextInput
                    style={{ paddingLeft: 10, height: 40, width: "80%" }}
                    placeholder="title for survey"
                    onChangeText={newText => setQuestionName(newText)}
                    value={questionName}

                />




            </View>

            {/*Inner blue box*/}
            <View style={{ flex: 8, height: "100%", width: "90%", borderRadius: 10, backgroundColor: "rgba(128,147,241,255)", alignItems: 'center', justifyContent: "center" }}>
                <View style={{ flex: 2, width: "100%", zIndex: 10, height: "100%",alignItems:"center",paddingTop:5 }}>

                    <Dropdown

                        data={questionTypes}
                        style={{ backgroundColor: "white", width:"90%", borderRadius:5, padding:4  }}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={"Written answer"}
                        value={questionType}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                         
                            setQuestionType(item.value);
                            setIsFocus(false);
                        }} />








                </View>
                <View style={{ flex: 9, justifyContent: "center", }}>
                    
                    <View style={{flex:1}}>

                        {props.questions[props.index].parentIndex != -1
                        && <View style={{flex:1}}>
                        <Text> Derived QuestionThis question will be shown if {props.questions[props.questions[props.index].parentIndex].questionName } is checked</Text></View>}
                        {props.questions[props.index].derived > 0
                        && <View style={{flex:1}}>
                        <Text> this question has {props.questions[props.index].derived } derived questions</Text></View>}
                   
                   
                    </View>
                    <View style={{flex:10}}>
                    {questionType === "Check Box" &&

                        <CheckBox
                            checked={isChecked}
                            checkedColor="#0F0"
                            containerStyle={{
                                width: "75%"
                            }}
                            testID={"surveyCheckBox"}
                            iconRight
                            onIconPress={() => setIsChecked(!isChecked)}
                            onPress={() => setIsChecked(!isChecked)}
                            size={30}
                            textStyle={{}}
                            title={questionName}
                            titleProps={{}}
                            uncheckedColor="#00F" />
                    }
                    </View>

                </View>


                <View style={{ flex: 1.2, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, width: "100%", paddingBottom: 10 }}>
                    <View >

                        {props.questions[props.index].derived === 0 && props.questions.length > 1 &&
                            <TouchableOpacity style={{ justifyContent: "center", backgroundColor: "rgba(201,194,194,255)", padding: 5, height: "100%", width: 80, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, .40)", }}
                                onPress={() => props.handleRemove(props.index)}>
                                <Text style={{ fontSize: 15, color: "white", textAlign: "center" }}>Remove</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View >


                        {questionType === "Check Box" &&
                            <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", backgroundColor: "rgba(30,196,176,255)", padding: 3, height: "100%", width: 80, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, 0.4)" }}
                                onPress={() => triggerQuestionChangeAddDerived()}>
                                <Text style={{ fontSize: 15, color: "white", textAlign: "center" }}>Derive</Text>
                            </TouchableOpacity>
                        }
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

});
export default CreateSurveyQuestions;