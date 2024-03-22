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

  const handleTakeSurvey = () => {
    // Handle the action when "Take Survey" button is pressed
  };

  return (
    <ScrollView
      contentContainerStyle={[ScreenStyles.CasiBlue, styles.container]}
    >
      <DrawerButton />
      <Text style={styles.title}>Surveys</Text>
      <View style={styles.boxContainer}>
        {[1, 2, 3, 4].map((quarter) => (
          <View key={quarter} style={styles.box}>
            <Text style={styles.boxText}>Quarter {quarter}</Text>
            <TouchableOpacity
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
