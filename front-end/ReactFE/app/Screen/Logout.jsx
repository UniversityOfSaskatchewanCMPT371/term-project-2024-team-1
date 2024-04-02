import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
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

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
