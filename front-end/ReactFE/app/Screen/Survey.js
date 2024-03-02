import {View, Text, Button, TouchableOpacity} from 'react-native'
import React from 'react'
import {ScreenStyles} from './Screen'
import {useNavigation} from '@react-navigation/native'
import DrawerButton from '../navigation/CustomDrawerButton'
export default function Survey({navigation}) {

    const mockSurveyInfo = {
        quarter: 1

    }
    const mockSurveyData = [
        {
            id: '0',
            title: 'Quarter 1 survey',
            questionHeader:"Echinococcus spp. (multilocularis, granulosus)",
            question: "Zoonotic Pathogens of interest: Echinococcus spp. (multilocularis, granulosus) A" +
                    "ny urban, rural or free- roaming dog residing in the provinces of BC, AB, SK, or" +
                    " MB with a positive fecal coproantigen ELISA or PCR test result for Echinococcus" +
                    " multilocularis or E. granulosus regardless of clinical signs."
        }, {
            id: '1',
            title: 'Quarter 1 survey',
            questionHeader:"MRSA/MRSP",
            question: 'MRSA/MRSP Any urban, rural or free-roaming dog residing in the provinces of BC, ' +
                    'AB, SK, or MB with a positive MRSA/MRSP result on culture and sensitivity testin' +
                    'g with resistance to one or more antibiotic(s) regardless of clinical signs.'

        }, {
            id: '2',
            title: 'Quarter 1 survey',
            questionHeader:"Enteric pathogens (Salmonella spp. Campylobacter spp. E.coli)",
            question: 'Enteric pathogens (Salmonella spp. Campylobacter spp. E.coli) Any urban, rural o' +
                    'r free-roaming dog residing in the provinces of BC, AB, SK, or MB and a positive' +
                    ' PCR test or fecal culture for Salmonella spp. Campylobacter spp., and/or E.coli' +
                    ' regardless of clinical signs.'
        }, {
            id: '3',
            title: 'Quarter 1 survey',
            questionHeader:"Lyme disease or other vector-borne diseases",
            question: 'Lyme disease or other vector-borne diseases Any urban, rural or free-roaming dog' +
                    ' residing in the provinces of BC, AB, SK, or MB with a positive in- clinic 40x S' +
                    'NAP test or laboratory confirmed positive for Lyme disease (Borrelia burgdorfer)' +
                    ' or other vector-bome diseases (e. Anaplasma, Erichia, etc) regardless of clinic' +
                    'al signs.'
        }, {
            id: '4',
            title: 'Quarter 1 survey',
            questionHeader:"Brucella canis",
            question: 'Brucella canis Any urban, rural or free-roaming dog residing in the provinces of' +
                    ' BC, AB, SK, or MB that is serological positive using RSAT and/or ACID, or isola' +
                    'tion of the pathogen regardless of clinical signs.'
        }
    ];

    return (

        <View
            style={[
            ScreenStyles.ScreenStyle, {
                justifyContent: "start",
                paddingTop: 40
            }
        ]}>

            <DrawerButton/>

            <View style={{
                flex: 0.3
            }}>
                <Text
                    style={{
                    color: "#fff",
                    fontSize: 50,
                    fontWeight: "bold"
                }}>CASI</Text>
            </View>
            <View style={{
                flex: 0.7
            }}>

                <Text
                    style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 30,
                    marginBottom: 30,
                    textAlign: "center"
                }}>SURVEY TEST</Text>

                <TouchableOpacity
                    testID='TakeSurvey'
                    onPress={() => {
                    navigation.navigate("SurveyStartBoard", {surveyData: mockSurveyData})
                }}
                    style={[ScreenStyles.CasiPurple, ScreenStyles.button]}>
                    <Text style={ScreenStyles.buttonText}>
                        Take Survey
                    </Text>

                </TouchableOpacity>

            </View>
        </View>
    )
}