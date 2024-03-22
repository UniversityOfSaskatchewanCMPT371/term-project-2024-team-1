
import React, {useState} from "react";

import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [userIdEmail, setUserIdEmail] = useState("");
    const [password, setPassword] = useState("");
    const {onLogin} = useAuth();

    const login = async () => {
        const result = await onLogin(userIdEmail, password);
        if(result && result.error){
          alert(result.msg)
        }
      };

    const navigation = useNavigation();
  return (
    <View testID="loginPage" style={loginStyles.container}>
      <TextInput
        testID="userIdEmailInput"
        style={loginStyles.input}
        placeholder="UserId or email"
        onChangeText={(text) => setUserIdEmail(text)}
      />
      <TextInput
        testID="passwordInput"
        style={loginStyles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <Button
        testID="loginButton"
        title="Login"
        onPress={login}
      />
      <TouchableOpacity
        testID="forgotPasswordLink"
        onPress={() => console.log("Forgot Password pressed")}
      >
        <Text>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="signUp">
            <Text>Sign up</Text>
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
    backgroundColor: "white",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    width: "100%",
  },
});

export default Login;
