import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { ScreenStyles } from "./Screen";
import DrawerButton from "../navigation/CustomDrawerButton";
import { useNavigation } from "@react-navigation/native";
import Survey from "./Survey";
import { ScrollView } from "react-native-gesture-handler";

const LandingPage = () => {
  const navigation = useNavigation();

  const handleTakeSurvey = () => {
    
  };

  return (
      <View style={[ScreenStyles.CasiBlue, ScreenStyles.container]}>
         
      <DrawerButton />
      <Text style={style.title}>CASI</Text>
      <Text style={style.paragraph}>
              Welcome to the western Canadian specific Companion Animal Surveillance Initiative.
              We greatly appreciate your participation!
              {"\n"}
              This initiative recognizes the importance of understanding current zoonotic disease occurrence in animals that share our homes, our food/water and our beds.
              {"\n"}
              Surveillance of selected companion animal diseases will provide baseline information upon which to evaluate changes over time, specifically those driven by external forces (i.e. climate-driven diseases, or even social contexts).
        {"\n\n"}
              Thank you for your cooperation.
              {"\n\n"}
          </Text>
        <Text style={style.about}>
          More info in <Text style={style.aboutLink}>About.</Text>
        </Text>
      <TouchableOpacity
        testID="takeSurveyButton"
        style={style.takeSurveyButton}
        onPress={handleTakeSurvey}
      >
        <Text style={style.takeSurveyButtonText}>Take Survey</Text>
          </TouchableOpacity>
          
    </View>
  );
};
const style = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff", 
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 14,
    color: "#ffffff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  takeSurveyButton: {
    backgroundColor: "blue", 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  takeSurveyButtonText: {
    color: "#ffffff", 
    fontSize: 18,
    fontWeight: "bold",
    },
  about: {
    marginTop: 16,
    color: "#ffffff",
  },
   aboutLink: {
    color: "blue", 
    textDecorationLine: 'underline',
  }
});

export default LandingPage;
