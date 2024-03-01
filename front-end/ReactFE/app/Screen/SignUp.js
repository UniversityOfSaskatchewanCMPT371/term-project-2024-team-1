import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet,Modal,ScrollView } from "react-native";
import { CheckBox } from 'react-native-elements';
import { signUp } from '../service/apiService';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clinic, setClinic] = useState('');
  const [agreeToEthics, setAgreeToEthics] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSignUp = async () => {
    try {
      // Check if the user has agreed to ethics before proceeding with sign-up
      if (!agreeToEthics) {
        toggleModal();
        return;
      }

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
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        {/* Password input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
             placeholderTextColor="#ffffff"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
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
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAgreeToEthics(!agreeToEthics)}
        >
          <Text style={styles.checkboxText}>Agree to Ethics</Text>
          {agreeToEthics && <Text style={styles.checkMark}>✔</Text>}
        </TouchableOpacity>

       
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
        {/*
        <Modal isVisible={isModalVisible} animationIn="slideInUp" animationOut="slideOutDown">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Ethics Agreement</Text>
            <ScrollView style={styles.modalScrollView}>
          
              <Text style={styles.modalText}>
              <Text style={{ fontWeight: 'bold' }}>Introduction:</Text>
              {'\n\n'}

                  The Companion Animal Surveillance Initiative (CASI) values the ethical principles that govern our research endeavors. As part of our commitment to transparency, integrity, and participant well-being, we have established the following ethical guidelines for veterinary clinics in Western Canada participating in the CASI survey app.

             {'\n\n'}
                <Text style={{ fontWeight: 'bold' }}>Informed Consent:</Text>
             {'\n\n'}

              By utilizing the CASI survey app, veterinary clinics and their participants acknowledge their voluntary participation in this initiative. Prior to using the app, clinics should inform their staff members about the purpose of CASI, emphasizing the voluntary nature of participation. Clinics are encouraged to ensure that all participating staff members understand the implications of their involvement.
            {'\n\n'}

              <Text style={{ fontWeight: 'bold' }}>Data Confidentiality and Security:</Text>
            {'\n\n'}
              CASI is dedicated to maintaining the confidentiality and security of all data collected through the survey app. Clinic information and survey responses will be stored separately, with survey data identified only by a clinic identifier. Access to this information will be restricted to authorized personnel involved in the research process, ensuring the privacy of participating clinics.
            {'\n\n'}

               <Text style={{ fontWeight: 'bold' }}>Purpose of Data Usage:</Text>

              Data collected through the CASI survey app will be used exclusively for research purposes related to companion animal and zoonotic diseases. The information will contribute to understanding disease trends, potential risks, and the development of preventive measures. Clinic-specific data will only be reported on a regional basis, protecting the identity of individual clinics.
            {'\n\n'}

             <Text style={{ fontWeight: 'bold' }}>Voluntary Participation and Withdrawal:</Text>
            {'\n\n'}
              Participation in CASI through the survey app is entirely voluntary. Clinics have the freedom to withdraw from the initiative at any point without facing any repercussions. Should a clinic choose to withdraw, their existing data will be retained for research purposes, but no further surveys will be collected.
            {'\n\n'}
              <Text style={{ fontWeight: 'bold' }}> Communication and Updates:</Text>
            {'\n\n'}
              Clinics participating in CASI can expect regular communication, including updates on the initiative's progress and findings. CASI is committed to providing meaningful information back to the clinics through short quarterly updates, disease alerts, and longer annual reports. This information will serve as valuable indicators of regional risks to companion animals.
            {'\n\n'}

              <Text style={{ fontWeight: 'bold' }}> Ethical Oversight:</Text>
            {'\n\n'}
              The CASI initiative is conducted under ethical approval from the University of Saskatchewan Behavioural Research Ethics Board (Beh 2787). The study is also funded by the Public Health Agency of Canada’s Infectious Disease and Climate Change Program. Clinics are encouraged to direct any ethical concerns or inquiries about their rights as participants to the USask Research Ethics Office.
            {'\n\n'}

             <Text style={{ fontWeight: 'bold' }}>Conclusion:</Text> 
            {'\n\n'}
              The CASI survey app aims to uphold the highest ethical standards throughout its research activities. By participating in this initiative, clinics play a vital role in advancing our understanding of companion animal health, and we appreciate their commitment to ethical research practices.
              {'\n\n'}

                  For further questions or concerns regarding the ethics of the CASI survey app, please contact Dr. Tasha Epp at compan.surv@usask.ca.
                    
              </Text>
              <View style={styles.checkboxContainer}>
              <CheckBox
                title="Agree to Ethics"
                checked={agreeToEthics}
                onPress={() => setAgreeToEthics(!agreeToEthics)}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
              />
            </View>
            </ScrollView>
            <TouchableOpacity onPress={toggleModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>*
        </Modal>*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },// Modal styles
  /*
  modalContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
  },
modalContainer: {
  backgroundColor: '#ffffff',
  padding: 20,
  borderRadius: 8,
  marginTop: 20, // Add marginTop to push the modal down
  flex: 1, // Add flex: 1 to allow the modal to take up the entire height
},
modalScrollView: {
  flex: 1, // Add flex: 1 to allow the ScrollView to take up the entire height
},
modalTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 16,
},
modalText: {
  fontSize: 16,
  marginBottom: 16,
},
modalButton: {
  backgroundColor: '#5d6ebe',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 16, // Add marginTop to push the button down
},
modalButtonText: {
  color: '#ffffff',
  fontSize: 16,
  fontWeight: 'bold',
},*/
});

export default SignUp;
