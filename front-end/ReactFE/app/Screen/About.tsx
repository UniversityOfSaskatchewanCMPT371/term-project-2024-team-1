import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { ScreenStyles } from "./Screen";
import DrawerButton from "../navigation/CustomDrawerButton";
import { useNavigation } from "@react-navigation/native";
import Survey from "./Survey";

const About = () => {
  const navigation = useNavigation();

  const handleReturn = () => {
    
  };

  return (
    <View style={[ScreenStyles.CasiBlue, ScreenStyles.container]}>
      <DrawerButton />
      <Text style={style.title}>Survey Completed</Text>
      <Text style={style.paragraph}>
        The Survey for this quarter has been submitted.
        {"\n\n"}
        Thank you for your cooperation.
      </Text>
      <TouchableOpacity
        testID="returnButton"
        style={style.returnButton}
        onPress={handleReturn}
      >
        <Text style={style.returnButtonText}>Return</Text>
      </TouchableOpacity>
    </View>
  );
};
const style = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff", // white text color
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },
  returnButton: {
    backgroundColor: "blue", // CasiDarkBlue
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  returnButtonText: {
    color: "#ffffff", // white text color
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default About;
