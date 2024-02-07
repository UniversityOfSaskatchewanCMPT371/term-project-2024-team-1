// Sample test login page component
// used for sample smoke tests
import React from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const TestLoginScreen = () => {
  return (
    <View testID="loginPage" style={loginStyles.container}>
      <TextInput
        testID="userIdInput"
        style={loginStyles.input}
        placeholder="UserID"
      />
      <TextInput
        testID="passwordInput"
        style={loginStyles.input}
        placeholder="Password"
        secureTextEntry={true}
      />
      <Button
        testID="loginButton"
        title="Login"
        onPress={() => console.log("Login pressed")}
      />
      <TouchableOpacity
        testID="forgotPasswordLink"
        onPress={() => console.log("Forgot Password pressed")}
      >
        <Text>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    width: "100%",
  },
});

export default TestLoginScreen;
