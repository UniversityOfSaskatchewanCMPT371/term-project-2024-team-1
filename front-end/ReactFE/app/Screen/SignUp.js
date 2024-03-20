import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet,Modal,ScrollView } from "react-native";
import { CheckBox } from 'react-native-elements';
import { signUp } from '../service/apiService';


const SignUp = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [clinic, setClinic] = useState('');
  const [agreeToEthics, setAgreeToEthics] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  {/*Handle email inputs to make sure they are not blank */}
  const handleEmail = (enteredEmail) => {
    setEmail(enteredEmail);
    setEmailVerify(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (enteredEmail.trim() !== '') {
      if (emailRegex.test(enteredEmail)) {
        setEmailVerify(true);
      }
    }
  };

  const handlePassword = (enteredPass) => {
    setPassword(enteredPass);
    setPasswordVerify(false);

    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /[0-9]/;

    if (
      enteredPass.length > 0 &&
      !(uppercaseRegex.test(enteredPass) && 
        specialCharRegex.test(enteredPass) && 
        numberRegex.test(enteredPass))
    ) {
      setPasswordVerify(true);
    }
  };


  const handleSignUp = async () => {
    try {
      // Navigate to the EthicsAgreementScreen
      navigation.navigate('Ethics', {
        agreeToEthics,
        setAgreeToEthics,
      });

      const registrationResponse = await signUp(email, password, clinic, agreeToEthics);

      setRegistrationSuccess(registrationResponse.success);

      if (!registrationResponse.success) {
        console.error('Registration failed', registrationResponse.message);
      }
    } catch (error) {
      console.error('Error during registration', error.message);
    }
  };
  return (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.logo}>CASI</Text>
        <Text style={styles.subtitle}>Sign Up</Text>

        {/* Email input */}
          <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ffffff"
        value={email}
        onChangeText={handleEmail}
      />
      {email.trim().length < 1 && email.trim().length < 9 || emailVerify ? null : (
        <Text style={styles.validation}>Please enter a valid email address</Text>
      )}
            {/*
             validationSchema(email)
    */}
    </View>

        {/* Password input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
             placeholderTextColor="#ffffff"
            secureTextEntry={true}
            value={password}
            onChangeText={handlePassword}
            />
          {password.trim().length < 1 || passwordVerify ? null : (
        <Text style={styles.validation}>
          Password must contain at least one uppercase letter, one special character, and one number
        </Text>
      )}
        </View>

        {/* Clinic input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Clinic"
             placeholderTextColor="#ffffff"
            value={clinic}
            onChangeText={(text) => setClinic(text)}
          />
        </View>

       {/* Agree to Ethics checkbox */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              title="Agree to Ethics"
              checked={agreeToEthics}
              onPress={() => setAgreeToEthics(!agreeToEthics)}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
            />
            </View>
       
        {/* Registration result display */}
        {registrationSuccess !== null && (
          <View>
            <Text style={styles.text}>
              {registrationSuccess ? 'Registration successful!' : 'Registration failed.'}
            </Text>
          </View>
        )}

        {/* Sign Up button */}
        <TouchableOpacity
          testID="signUpButton"
          style={styles.signUpButton}
          onPress={handleSignUp}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Already have an account? Log in */}
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Log in</Text>
        </Text>
      </View>
      </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  validation: {
      color: 'red',
      fontSize: 12,
      marginTop: 5,
    },

  inputContainer: {
    backgroundColor: "#5d6ebe", // CasiDarkBlue
    borderRadius: 8,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '80%', // occupy 80% of the width
  },
  input: {
    color: "#ffffff", // white text color
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 0,
    padding: 0,
  },
  checkboxText: {
    color: '#ffffff', // white text color
    fontSize: 18,
    fontWeight: '500',
  },
  text: {
    color: "#ffffff", // white text color
    fontSize: 20,
    fontWeight: "500",
  },
  signUpButton: {
    backgroundColor: "blue", // CasiDarkBlue
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  signUpButtonText: {
    color: "#ffffff", // white text color
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 16,
    color: "#ffffff", // white text color
  },
  loginLink: {
    color: "blue", // white text color
    textDecorationLine: 'underline',
  }
});

export default SignUp;