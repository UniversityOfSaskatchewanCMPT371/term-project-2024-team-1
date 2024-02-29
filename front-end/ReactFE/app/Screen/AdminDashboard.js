import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ScreenStyles } from "./Screen";

const AdminDashboard = () => {
  return (
    <View
      style={[
        ScreenStyles.ScreenStyle,
        { justifyContent: "start", paddingTop: 40 },
      ]}
    >
      <Text style={{ color: "#fff", fontSize: 50, fontWeight: "bold" }}>
        ADMIN CASI
      </Text>
      <View style={{ marginTop: "50%" }}>
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 30,
            marginBottom: 30,
          }}
        >
          Create Survey
        </Text>
        <Button
          color="#1EC4B0"
          style={[ScreenStyles.CasiTeal, ScreenStyles.button]}
          title="Create Survey"
        />
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 30,
            marginBottom: 30,
          }}
        >
          Download Results
        </Text>
        <Button
          color="#25177B"
          style={[ScreenStyles.CasiPurple, ScreenStyles.button]}
          title="Download Results"
        />
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 30,
            marginBottom: 30,
          }}
        >
          ID Requests
        </Text>
        <Button
          color="#25177B"
          style={[ScreenStyles.CasiPurple, ScreenStyles.button]}
          title="ID Requests"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: "25%",
    backgroundColor: "#2D2D2D",
    alignItems: "center",
    paddingTop: 20, // Adjust as needed
  },
  headerText: {
    color: "white",
    fontSize: 24,
    marginBottom: 30, // Adjust as needed
  },
  button: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10, // Adjust as needed
    borderBottomWidth: 1,
    borderBottomColor: "gray", // Adjust as needed
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  content: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
  },
  mainButton: {
    width: "50%",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    borderRadius: 5,
  },
});

export default AdminDashboard;
