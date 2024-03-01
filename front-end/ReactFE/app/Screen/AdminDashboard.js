import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScreenStyles } from "./Screen";

export default function AdminDashboard() {
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
      <View style={{ marginTop: "50%", alignItems: "center" }}>
        <TouchableOpacity
          style={[ScreenStyles.CasiTeal, ScreenStyles.button]}
          onPress={() => {
            console.log("Create Survey Pressed");
          }}
        >
          <Text style={ScreenStyles.buttonText}>+ Create Survey</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ScreenStyles.CasiPurple, ScreenStyles.button]}
          onPress={() => {
            console.log("Download Results Pressed");
          }}
        >
          <Text style={ScreenStyles.buttonText}>Download Results</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ScreenStyles.CasiPurple, ScreenStyles.button]}
          onPress={() => {
            console.log("ID Requests Pressed");
          }}
        >
          <Text style={ScreenStyles.buttonText}>ID Requests</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
