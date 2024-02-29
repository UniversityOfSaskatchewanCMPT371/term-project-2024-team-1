import { View, Text } from "react-native";
import React from "react";
import { ScreenStyles } from "./Screen";

export default function IDRequests() {
  return (
    <View
      style={[
        ScreenStyles.ScreenStyle,
        { justifyContent: "start", paddingTop: 40 },
      ]}
    >
      <Text style={{ color: "#fff", fontSize: 50, fontWeight: "bold" }}>
        CASI
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
          ID Requests
        </Text>
      </View>
    </View>
  );
}
