<<<<<<< HEAD
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from 'react-native'
=======
import { View, Text, TouchableOpacity, TextInput, Modal,ScrollView } from 'react-native'
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667
import React, { useState, useRef, useEffect } from 'react'
import { ScreenStyles } from './Screen'
import DrawerButton from './navigation/CustomDrawerButton'
import { Entypo } from '@expo/vector-icons'
import CreateSurveyQuestions from './CreateSurveyQuestions'
import KeyboardAvoidingContainer from './KeyboardAvoidContainer'
//import * as RNFS from 'react-native-fs';

const CreateSurvey = ({ navigation }) => {

    const [surveyTitle, setSurveyTitle] = useState("")
<<<<<<< HEAD


=======
    const [modalText, setModalText] = useState("")
    const [modalVisible, setModalVisible] = useState(false);
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667

    const [surveyQuestions, setSurveysQuestions] = useState([{ "index": 0, "questionName": "", "type": "Written Answer", "derived": 0, "parentIndex": -1, "MC":[] }])
    const createQuestionRef = useRef(null);
    const [currentSurveyIndex, setCurrentSurveyIndex] = useState(0);




    const triggerDone = () => {
<<<<<<< HEAD
        createQuestionRef.current.triggerDone();

=======

      
        if(surveyTitle === "") { setModalText("Survey Title cant be empty"); setModalVisible(true);}
        else
        createQuestionRef.current.triggerDone();
       
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667
    }

    const convertToNested = (questionInfo, index) => {

        let survey = {"name":surveyTitle,"dateCreated":Date()}
        let currentQuestions = [...surveyQuestions]
        questionInfo["index"] = index;

        currentQuestions[index] = questionInfo;
        currentQuestions.map(a => a["children"] = [])
<<<<<<< HEAD
=======



        let valid = true;
        
        for(let i =0; i<currentQuestions.length;i++){
            if(currentQuestions[i].questionName===""){
                valid = false;
                break;
            }
        }
        if(!valid){
            setModalText("Survey question cant be empty"); 
        setModalVisible(true);
        return
        }
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667
        let questionConvert = []




        for(let i = 0; i< currentQuestions.length;i++){
            questionConvert[i] = {}
            questionConvert[i]["questionName"] = currentQuestions[i]["questionName"]
            questionConvert[i]["type"] = currentQuestions[i]["type"]
            questionConvert[i]["children"] = currentQuestions[i]["children"]
            questionConvert[i]["MC"] = currentQuestions[i]["MC"]
        }
        
       



        for (let i = currentQuestions.length - 1; i >= 0; i--) {
            let parent = currentQuestions[i].parentIndex;
           
            
            

<<<<<<< HEAD
=======

>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667
            if (parent != -1) {
                questionConvert[parent]["children"].unshift({ ...questionConvert[i] })
                questionConvert.splice(i, 1)


            }




        }

        survey["questions"] = questionConvert


        


        console.log(survey);
     




        setSurveysQuestions(currentQuestions);
    }

 



    const writeFile = (data) => {
        data = [data]
        /*var path = RNFS.DocumentDirectoryPath + '/test.txt';
      
        RNFS.writeFile(path, JSON.stringify(data), 'utf8')
         .then(() => console.log('FILE WRITTEN!'))
         .catch((err) => console.log(err.message));
         */
     }
  
   
  
   
    const setQuestion = (questionInfo, index) => {



        let currentQuestions = [...surveyQuestions]
        questionInfo["index"] = index;

        currentQuestions[index] = questionInfo

        setSurveysQuestions(currentQuestions);

    }


    const setQuestionAdd = (questionInfo, index) => {



        let currentQuestions = [...surveyQuestions]
        questionInfo["index"] = index;

        currentQuestions[index] = questionInfo


        let nextIndex = index + 1;
        let found = false
        for (let i = nextIndex; i < currentQuestions.length; i++) {

            nextIndex = i;

            if (currentQuestions[nextIndex].parentIndex == -1 && currentQuestions[nextIndex].derived == 0) {
                found = true;
                break
            }
        }




        if(!found){
            nextIndex= currentQuestions.length;
            setCurrentSurveyIndex(nextIndex);
            currentQuestions.push({ "index": nextIndex, "questionName": "", "type": "Written Answer", "derived": 0, "parentIndex": -1,"MC":[] })
            setSurveysQuestions(currentQuestions);
        }

        else{
            

            setCurrentSurveyIndex(nextIndex);
            currentQuestions.splice(nextIndex, 0, { "index": nextIndex, "questionName": "", "type": "Written Answer", "derived": 0, "parentIndex": -1,"MC":[] })
    
            for (let i = nextIndex + 1; i < currentQuestions.length; i++) {
                currentQuestions[i].index += 1;
                if (currentQuestions[i].parentIndex != -1 && currentQuestions[i].parentIndex > nextIndex) {
                    currentQuestions[i].parentIndex += 1
                }
            }
            setSurveysQuestions(currentQuestions);

        }
        

       
    


       
        createQuestionRef.current.setDefaultValues();

    }

    const setQuestionAddDerived = (questionInfo, index) => {



        let currentQuestions = [...surveyQuestions]
        questionInfo["index"] = index;

        currentQuestions[index] = questionInfo



        let nextIndex = index + 1;
        let found = false;
        for (let i = nextIndex; i < currentQuestions.length; i++) {

            nextIndex = i;

            if (currentQuestions[nextIndex].parentIndex != index) {
                found=true;
                break
            }
        }



       
       

        if(!found){
            nextIndex=currentQuestions.length;
            setCurrentSurveyIndex(nextIndex);
            currentQuestions.push( { "index": nextIndex, "questionName": "", "type": "Written Answer", "derived": 0, "parentIndex": index,"MC":[] })
        }
        else {
            setCurrentSurveyIndex(nextIndex);
            currentQuestions.splice(nextIndex, 0, { "index": nextIndex, "questionName": "", "type": "Written Answer", "derived": 0, "parentIndex": index,"MC":[] })

            for (let i = nextIndex + 1; i < currentQuestions.length; i++) {
                currentQuestions[i].index += 1;
                if (currentQuestions[i].parentIndex != -1 && currentQuestions[i].parentIndex > nextIndex) {
                    currentQuestions[i].parentIndex += 1
                }
            }
        }

     
       
        setSurveysQuestions(currentQuestions);
        createQuestionRef.current.setDefaultValues();

    }

    const addNewQuestion = () => {

        createQuestionRef.current.triggerQuestionChangeAdd();



    }

    const switchQuestion = (val) => {

        const newIndex = currentSurveyIndex + val;
        
        setCurrentSurveyIndex(newIndex);
      
        createQuestionRef.current.switchQuestion(newIndex);
    }


    const handleRemove = (index) => {
        let currentQuestions = [...surveyQuestions]

     
<<<<<<< HEAD

=======
        console.log(index)
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667
        for (let i = index + 1; i < currentQuestions.length; i++) {
            currentQuestions[i].index -= 1;
            if (currentQuestions[i].parentIndex != -1 && currentQuestions[i].parentIndex > index) {
                currentQuestions[i].parentIndex -= 1;
            }

        }

        if (currentQuestions[index].parentIndex != -1) {
            currentQuestions[currentQuestions[index].parentIndex].derived -= 1;
        }


<<<<<<< HEAD
    
=======
        currentQuestions.splice(index,1);
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667

        if (index > 0) {
            switchQuestion(-1);
            setSurveysQuestions(currentQuestions);
        }
        else {
            setSurveysQuestions(currentQuestions);
            createQuestionRef.current.setDefaultValues(currentQuestions[0].type, currentQuestions[0].questionName, currentQuestions[0]["MC"]);

        }



    }

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#7f92f0" }}>
<<<<<<< HEAD
=======
             <ScrollView style={{ flexGrow: 1, width:"100%",}} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', width:"100%" }}>
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667

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
                            console.log(surveyQuestions)
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

                    <CreateSurveyQuestions childRef={createQuestionRef} handleRemove={handleRemove} triggerDone={convertToNested} setQuestion={setQuestion} setQuestionAdd={setQuestionAdd} setQuestionAddDerived={setQuestionAddDerived} questions={surveyQuestions} index={currentSurveyIndex} />

                </View>
                <View style={{ flex: 1.3, justifyContent: "space-between", flexDirection: "row", width: "100%", alignItems: "center", paddingVertical: 10 }}>
                    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}>

                        {currentSurveyIndex > 0 &&
<<<<<<< HEAD
                            <TouchableOpacity style={{ flex: 1, backgroundColor: "white", padding: 3, height: 20, width: 80, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, 0.4)", alignItems: "center", }}
=======
                            <TouchableOpacity style={{ flex: 1, backgroundColor: "white", padding: 3, height: 50, width: 80, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, 0.4)", alignItems: "center", }}
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667
                                onPress={() => switchQuestion(-1)}>
                                <Text style={{ fontSize: 30, fontWeight: "bold", color: "black", textAlign: "center" }}>{"<-"} </Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

<<<<<<< HEAD
                        <TouchableOpacity style={{ flex: 1, backgroundColor: "white", padding: 3, height: 20, width: 80, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, 0.4)", alignItems: "center", }}
=======
                        <TouchableOpacity style={{ flex: 1, backgroundColor: "white", padding: 3, height: 50, width: 80, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, 0.4)", alignItems: "center", }}
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667
                            onPress={() => addNewQuestion()}>
                            <Text style={{ fontSize: 30, fontWeight: "bold", color: "black", textAlign: "center" }}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}>

                        {currentSurveyIndex < surveyQuestions.length - 1 &&
<<<<<<< HEAD
                            <TouchableOpacity style={{ flex: 1, backgroundColor: "white", padding: 3, height: 20, width: 80, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, 0.4)", alignItems: "center", }}
=======
                            <TouchableOpacity style={{ flex: 1, backgroundColor: "white", padding: 3, height: 50, width: 80, borderRadius: 10, borderWidth: 2, borderColor: "rgba(0,0,0, 0.4)", alignItems: "center", }}
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667
                                onPress={() => switchQuestion(1)}>
                                <Text style={{ fontSize: 30, fontWeight: "bold", color: "black", textAlign: "center" }}>{"->"}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>

            </View>

            <View style={{ flex: 1, paddingTop: 20, paddingBottom: 20, width: "100%", justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                    testID='DoneButton'
                    onPress={() => {
                        triggerDone();
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
<<<<<<< HEAD
=======


            <Modal
        animationType="slide"
        style={{height:400, flex:1}}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
        
          setModalVisible(!modalVisible);
        }}>
        <View style={{ flex:1, justifyContent:"center", alignItems:"center", paddingBottom:20, height:200,backgroundColor: "rgba(225,229,245,255)"}}>
          <View style={{flex:1,justifyContent:"center", alignItems:"center", height:200, width:"80%", borderRadius:10,backgroundColor: "rgba(225,229,245,255)"}}>
            <Text style={{fontSize:20, marginBottom:40}}>{modalText}</Text>
            <TouchableOpacity
              style={{ width:100, padding:10, backgroundColor: "blue",   }}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={{ textAlign:"center", color:"white", fontSize:25}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </ScrollView>
>>>>>>> 2dd1da0c31869c81f2dca8c19ae5546781edf667
        </View>
    )
}

export default CreateSurvey;