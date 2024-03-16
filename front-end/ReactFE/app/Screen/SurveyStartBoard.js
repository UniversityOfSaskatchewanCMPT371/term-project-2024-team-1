import {
    View,
    Text,
    FlatList,
    Animated,
    useWindowDimensions,
    TouchableOpacity
} from 'react-native'
import React, {useState, useRef} from 'react'
import {ScreenStyles} from './Screen'
import DrawerButton from '../navigation/CustomDrawerButton'
import SurveyModal from './SurveyModal'
import Paginator from '../navigation/Paginator'

export default function SurveyStartBoard({navigation, route}) {

    const {width} = useWindowDimensions();

    const surveyData = route.params.surveyData;
    const handleStart = () => {
        navigation.navigate("SurveyBoard", {surveyData: surveyData})
    }
    const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;
    return (
        <View
            style={[
            ScreenStyles.ScreenStyle, {
                flex: 1
            }
        ]}>
            <DrawerButton/>

            <View
                style={{
                flex: 0.2,
                justifyContent: "center",
                alignContent: "center"
            }}>
                <Text
                    style={{
                    color: "#fff",
                    fontSize: 50,
                    fontWeight: "bold"
                }}>Survey</Text>
            </View>
            <View
                style={[
                {
                    flex: 0.8,
                    marginHorizontal: 10,
                    marginBottom: 10
                },
                ScreenStyles.modal
            ]}>
                <View
                    style={[{
                        flex: 3
                    }
                ]}
                    testID='surveyStartCard'>

                    <FlatList style={{flex:1}}
                       data={surveyData.map((item, index) => ({ ...item, index }))}
                        renderItem={({item,index}) => (
                        <View
                            style={{
                            flex: 1,
                            marginBottom:10,
                            paddingHorizontal:20,
                            alignItems:"center"
                        }}
                            key={"question" + item.id.toString()}>
                             
                            <Text style={{fontSize:25}}>  <Text style={{fontSize:25,fontWeight:"bold"}}>{index}: </Text>{item.question}</Text>
                        </View>
                    )}
                        bounces={false}
                        keyExtractor={(surveyData) => surveyData.id}/>

                    <View
                        style={[{
                            flex: 0.2,
                            paddingTop: 10,
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    ]}>
                        <Paginator data={surveyData} scrollX={undefined} index ={-1}/>
                        <View
                            style
                            ={{
                            flex: 1,
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                            width: width - 20,
                            paddingRight: 20,
                            paddingBottom: 20
                        }}>
                            <TouchableOpacity
                                onPress={() => handleStart()}

                                style={{
                                backgroundColor: "darkblue",
                                borderRadius: 10,
                                height: 50,
                                width: 100,
                               
                            }} testID="startSurvey">
                                <Text
                                    style={{
                                    textAlign: "center",
                                    color: "white",
                                    fontSize: 20,
                                    padding: 10
                                }}>Start</Text>
                            </TouchableOpacity>
                        </View>
                        <View/>

                    </View>
                </View>

            </View>

        </View>
    )
}
