import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ScreenStyles } from "./Screen";
import DrawerButton from "../navigation/CustomDrawerButton";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  const { onLogout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await onLogout();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.confirmText}>Are you sure you want to logout?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogout} style={[styles.button, styles.yesButton]}>
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, styles.noButton]}>
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7f92f0"
  },
  confirmText: {
    fontSize: 20,
    marginBottom: 20,
    color: "#ffffff",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  yesButton: {
    backgroundColor: "green",
  },
  noButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default Logout;
