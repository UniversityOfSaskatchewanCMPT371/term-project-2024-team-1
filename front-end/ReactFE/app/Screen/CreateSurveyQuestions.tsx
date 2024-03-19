
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

    const triggerDone = () => {
        let question = { ...props.questions[props.index] }
        question["questionName"] = questionName;
        question["type"] = questionType
        question["MC"] = MCQuestions;
        props.triggerDone(question, props.index);
    }
    const triggerQuestionChange = () => {

        let question = { ...props.questions[props.index] }
        question["questionName"] = questionName;
        question["type"] = questionType
        question["MC"] = MCQuestions;
        props.setQuestion(question, props.index);
    }
    const triggerQuestionChangeAdd = () => {
        let question = { ...props.questions[props.index] }
        question["questionName"] = questionName;
        question["type"] = questionType
        question["MC"] = MCQuestions;

        props.setQuestionAdd(question, props.index);
    }

    const triggerQuestionChangeAddDerived = () => {
        let question = { ...props.questions[props.index] }
        question["questionName"] = questionName;
        question["type"] = questionType
        question["derived"] += 1
        question["MC"] = MCQuestions;


        props.setQuestionAddDerived(question, props.index);
    }

    const setDefaultValues = (type = "Written Answer", name = "", MC=[]) => {


        setQuestionType(type);
        setQuestionName(name);
        setMCQuestions(MC);
    }


    const modifyMC = (i, val) =>{
        let mc = [...MCQuestions]

        mc[i] = val

        setMCQuestions(mc);


    }
    const addNewMC = () => {
        let mc = [...MCQuestions]

        mc.push(" ")

        setMCQuestions(mc);
       
    }

    const removeMC = (i) => {
        let mc = [...MCQuestions]

        mc.splice(i,1)

        setMCQuestions(mc);
    }
    const switchQuestion = (index) => {
        /*maybe needs to be optimized*/
        triggerQuestionChange();
        const newQuestion = props.questions[index];
        setQuestionType(newQuestion.type);
        setQuestionName(newQuestion.questionName);
        setMCQuestions(newQuestion["MC"])


    }
    props.childRef.current = {
        triggerQuestionChange: triggerQuestionChange,
        triggerQuestionChangeAdd: triggerQuestionChangeAdd,
        switchQuestion: switchQuestion,
        setDefaultValues: setDefaultValues,
        triggerDone: triggerDone
    };

    return (
        <View style={[styles.container, { width: "100%" }]}>

            {/*survey input*/}
<<<<<<< HEAD
            <View style={{ flex: 1, marginVertical: 20, borderRadius: 10, width: "80%", padding: 0, justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1 }}>
=======
            <View style={{ flex: 1, marginVertical: 10, borderRadius: 10, width: "80%", padding: 0, justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1 }}>
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667

                {/*dropDown */}


                <TextInput
                    style={{ paddingLeft: 10, height: 40, width: "80%" }}
<<<<<<< HEAD
                    placeholder="title for survey"
=======
                    placeholder="Question Name"
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667
                    onChangeText={newText => setQuestionName(newText)}
                    value={questionName}

                />




            </View>

            {/*Inner blue box*/}
            <View style={{ flex: 8, height: "100%", width: "90%", borderRadius: 10, backgroundColor: "rgba(128,147,241,255)", alignItems: 'center', justifyContent: "center" }}>
<<<<<<< HEAD
                <View style={{ flex: 2, width: "100%", zIndex: 10, height: "100%", alignItems: "center", paddingTop: 5 }}>
=======
                <View style={{ flex: 2, width: "100%", zIndex: 10, height: "100%", alignItems: "center", paddingTop: 5,marginBottom:5 }}>
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667

                    <Dropdown

                        data={questionTypes}
                        style={{ backgroundColor: "white", width: "90%", borderRadius: 5, padding: 4 }}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={"Written answer"}
                        value={questionType}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {

                            if(questionType =="Check Box" && props.questions[props.index].derived !=0)
                                return
                            setQuestionType(item.value);
                            setIsFocus(false);
                        }} />








                </View>
                <View style={{ flex: 9, justifyContent: "center",width:"100%" }}>
                    <ScrollView style={{ flexGrow: 1, width:"100%",}} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', width:"100%" }}>

                        <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                            {props.questions[props.index] !== undefined && props.questions[props.index] !== undefined && props.questions[props.index].parentIndex != -1
                                && <View style={{ flex: 1 }}>
                                    <Text> Derived Question This question will be shown if {props.questions[props.questions[props.index].parentIndex].questionName} is checked</Text></View>}
                            {props.questions[props.index] !== undefined && props.questions[props.index] !== undefined && props.questions[props.index].derived > 0
                                && <View style={{ flex: 1, width:"80%" }}>
                                    <Text style={{textAlign:"center"}}> this question has {props.questions[props.index].derived} nested questions  Type cannot be change untill nested questions are removed</Text></View>}
                        </View>


                        <View style={{ flex: 3, justifyContent:"space-between", alignItems: "center",width:"100%" }}>
                            {questionType === "Check Box" &&


                                <View style={{flex:1, width:"80%", backgroundColor:"white", padding:0, margin:0, alignItems:"flex-start", justifyContent:"flex-start"}}>
                                <CheckBox
                                
                                    checked={isChecked}
                                    checkedColor="#0F0"
                                    containerStyle={{
                                        width: "95%",
                                        backgroundColor:"white",
                                        borderWidth:0,
                                        height:"100%",
                                        marginLeft:-10,
                                        padding:0,
                                        margin:0
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
                                    </View>
                            }

                            {questionType == "Multiple Choice" && props.questions[props.index] !== undefined &&


                                <View style={{ flex: 1, width: "100%", justifyContent:"center", alignItems:"center" }}>


                                    {
                                        MCQuestions.map((e, i) => <View key={"MC" + i.toString()} style={{ width: "90%",flex: 1, flexDirection:"row", backgroundColor:"white", borderRadius:5, marginBottom:5,padding:4, justifyContent:"space-between", alignItems:"center", height:50 }}>
                                           
                                           <View style={{flex:2}}>
                                           <Text style={{fontSize:20}}>{i}:</Text>
                                            </View>


                                            <View style={{flex:10}}>
                                            <TextInput
                                                style={{ paddingLeft: 10,  fontSize:20}}
                                                placeholder="title for survey"
                                                onChangeText={newText => modifyMC(i,newText)}
                                                value={MCQuestions[i]}

                                            />
                                            </View>

                                            <View style={{flex:1}}>
                                            <TouchableOpacity onPress={()=>removeMC(i)}>
                                            <Entypo name="circle-with-cross" size={20} style={{color:"red"}} />
                                            </TouchableOpacity>
                                            </View>
                                        </View>)
                                    }
                                    <View style={{flex:1,width:"100%", justifyContent:"flex-end", alignItems:"flex-end", paddingLeft:10,paddingBottom:10,paddingTop:5}}>
                                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", backgroundColor: "blue", padding: 3,  width: 100, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, 0.4)", height:40 }}
                                        onPress={() => addNewMC()}>
                                        <Text style={{ fontSize: 20, color: "white", textAlign: "center",  }}>Add new</Text>
                                    </TouchableOpacity>
                                    </View>
                                </View>
                            }
                        </View>



                    </ScrollView>
                </View>


                <View style={{ flex: 1.2, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, width: "100%", paddingBottom: 10, paddingTop:5 }}>
                    <View >

                        {props.questions[props.index] !== undefined && props.questions[props.index].derived === 0 && props.questions.length > 1 &&
                            <TouchableOpacity style={{ justifyContent: "center", backgroundColor: "rgba(201,194,194,255)", padding: 5, height: 40, width: 100, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, .40)", }}
                                onPress={() => props.handleRemove(props.index)}>
                                <Text style={{ fontSize: 18, color: "white", textAlign: "center" }}>Remove</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View >


                        {questionType === "Check Box" &&
                            <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", backgroundColor: "rgba(30,196,176,255)", padding: 3, height: 40, width: 100, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, 0.4)" }}
                                onPress={() => triggerQuestionChangeAddDerived()}>
                                <Text style={{ fontSize: 18, color: "white", textAlign: "center" }}>Nest</Text>
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