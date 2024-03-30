// Preconditions:
// - Ensure that "react", "react-native", "react-navigation/native", and any other required modules are properly installed and available.
// - Make sure that the ScreenStyles.CasiBlue style is defined in the Screen module and properly exported.
// - Confirm that the "TakeSurvey" screen is correctly configured and exists within the navigation stack.

// Postconditions:
// - After rendering, the SurveyList component displays a scrollable list of quarters with a "Take Survey" button for each quarter.
// - Upon clicking the "Take Survey" button, the user is navigated to the "TakeSurvey" screen.
// - The styling of the SurveyList component adheres to the defined styles, including the title, box layout, and button appearance.

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ScreenStyles } from "./Screen";
import DrawerButton from "../navigation/CustomDrawerButton";
import { useNavigation } from "@react-navigation/native";

const SurveyList = () => {
  const navigation = useNavigation();

  // Precondition:
  // - useNavigation hook from "@react-navigation/native" is used to access the navigation object.

  const handleTakeSurvey = () => {
    navigation.navigate("TakeSurvey");
  };

  // Precondition:
  // - handleTakeSurvey function is defined to navigate to the "TakeSurvey" screen upon button press.

  return (
    <ScrollView testID="SurveysID"
      contentContainerStyle={[ScreenStyles.CasiBlue, styles.container]}
    >
      <DrawerButton />
      <Text style={styles.title}>Surveys</Text>
      <View style={styles.boxContainer}>
        {[1, 2, 3, 4].map((quarter) => (
          <View key={quarter} style={styles.box}>
            <Text style={styles.boxText}>Quarter {quarter}</Text>
            <TouchableOpacity
              testID={"surveyQuarter"+String(quarter)+"ID"}
              style={styles.takeSurveyButton}
              onPress={handleTakeSurvey}
            >
              <Text style={styles.takeSurveyButtonText}>Take Survey</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  boxContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  box: {
    backgroundColor: "#5d6ebe",
    width: 200,
    height: 150,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 8,
    padding: 10,
  },
  boxText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    flex: 1,
    justifyContent: "center",
  },
  takeSurveyButton: {
    backgroundColor: "#4CAF50",
    width: "80%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  takeSurveyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SurveyList;

// Postcondition:
// - SurveyList component is exported as the default export for use in other parts of the application.
