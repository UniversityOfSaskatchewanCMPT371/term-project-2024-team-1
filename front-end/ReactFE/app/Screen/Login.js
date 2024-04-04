
import React, {useState} from "react";

import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
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
  
  const handleSignUp = () => {
    navigation.navigate("SignUp");
  }
  return (
    <ScrollView testID="loginPage" contentContainerStyle={loginStyles.scrollContainer}>
    <View style={loginStyles.container}>
      <View style={loginStyles.centeredContent}>
        <Text style={loginStyles.logo}>CASI</Text>
      <View style={loginStyles.inputContainer}>
      <TextInput
        testID="userIdEmailInput"
        style={loginStyles.input}
        placeholder="UserId or email"
        onChangeText={(text) => setUserIdEmail(text)}
          />
        </View>
          <View style={loginStyles.inputContainer}>
          <TextInput
        testID="passwordInput"
        style={loginStyles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
            />
            </View>
      <TouchableOpacity
        testID="loginButton"
        onPress={login}
        style={loginStyles.loginButton}>
        <Text style={loginStyles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="forgotPasswordLink"
        onPress={() => console.log("Forgot Password pressed")}
      >
        <Text style={loginStyles.input}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        testID="signUp"
      onPress={handleSignUp}>
        <Text style={loginStyles.input}> Don't have an account? <Text  style={loginStyles.signUpLink}>Sign up</Text>
        </Text>
        </TouchableOpacity>
        </View>
        </View>
    </ScrollView>
  );
};

const loginStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',

  },
  container: {
    flex: 1,
    backgroundColor: "#7f92f0", // CasiBlue
    justifyContent: 'center', // center vertically
  },
  centeredContent: {
    alignItems: 'center', // center horizontally
    paddingHorizontal: 20,
    },
   logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff", // white text color
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ffffff", // white text color
  },
  inputContainer: {
    backgroundColor: "#5d6ebe", // CasiDarkBlue
    borderRadius: 8,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '80%', // occupy 80% 
  },
  input: {
    color: "#ffffff", // white text color
  },
  loginButton: {
    backgroundColor: "blue", // CasiDarkBlue
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#ffffff", // white text color
    fontSize: 18,
    fontWeight: "bold",
  },
   signUpLink: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default Login;
