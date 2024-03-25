import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { ScreenStyles } from "./Screen";
import DrawerButton from "../navigation/CustomDrawerButton";
import { useNavigation } from "@react-navigation/native";
import Survey from "./Survey";

const ContactUs = () => {
  const navigation = useNavigation();

  const handleReturn = () => {};

  return (
    <View style={[ScreenStyles.CasiBlue, ScreenStyles.container]}>
      <DrawerButton />
      <Text style={style.title}>Contact Us</Text>
      <Text style={style.paragraph}>
        Thank you again for your participation. Communications regarding the
        Surveillance initiative, including reports, infographics and highlights,
        will be communicated through the WeCAHN website. The next survey which
        you can complete, which will focus on specific disease diagnoses, will
        be made available in month 20xx (see notifications tab for reporting
        time periods). Should you have any questions,
        {"\n\n"} Should you have any questions, you can email the Surveillance
        lead:
        {"\n"}
        Dr.Tasha Epp:
      </Text>
      <Text style={style.emailLink}>tasha.epp@usask.ca</Text>
      <Text style={style.paragraph}>{"\n\n"}The Surveillance Initiative:</Text>
      <Text style={style.emailLink}>compan.surv@usask.ca</Text>
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
    paddingHorizontal: 20,
  },
  emailLink: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
export default ContactUs;
