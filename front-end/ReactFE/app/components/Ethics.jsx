import React from 'react';
import { ScrollView, View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import { CheckBox } from 'react-native-elements';

const Ethics = ({ route }) => {
    const { agreeToEthics, setAgreeToEthics } = route.params;
    const handleAgreePress = () => {
    //stub for now but will handle logic to take to log in page or sign up depending on if we notify of request for id has been sent 
    console.log('User agreed to ethics');
  };


  return (
    <ScrollView contentContainerStyle={styles.ethicsContainer}>
      <View>
        <Text style={styles.title}>Ethics Agreement</Text>
        <ScrollView style={styles.ethicsScrollView}>
          <Text style={styles.modalText}>
            <Text style={{ fontWeight: 'bold' }}>Introduction:</Text>
            {'\n\n'}

            The Companion Animal Surveillance Initiative (CASI) values the ethical principles that govern our research endeavors. As part of our commitment to transparency, integrity, and participant well-being, we have established the following ethical guidelines for veterinary clinics in Western Canada participating in the CASI survey app.

            {'\n\n'}
            <Text style={{ fontWeight: 'bold' }}>Informed Consent:</Text>
            {'\n\n'}

            By utilizing the CASI survey app, veterinary clinics and their participants acknowledge their voluntary participation in this initiative. Prior to using the app, clinics should inform their staff members about the purpose of CASI, emphasizing the voluntary nature of participation. Clinics are encouraged to ensure that all participating staff members understand the implications of their involvement.
            {'\n\n'}

            {/* ... Other sections ... */}

            <Text style={{ fontWeight: 'bold' }}>Conclusion:</Text>
            {'\n\n'}
            The CASI survey app aims to uphold the highest ethical standards throughout its research activities. By participating in this initiative, clinics play a vital role in advancing our understanding of companion animal health, and we appreciate their commitment to ethical research practices.
                      {'\n\n'}
                      
            For further questions or concerns regarding the ethics of the CASI survey app, please contact Dr. Tasha Epp at compan.surv@usask.ca.
                  </Text>
                   <TouchableOpacity style={styles.agreeButton} onPress={handleAgreePress}>
          <Text style={styles.agreeButtonText}>Agree</Text>
        </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ethicsContainer: {
    backgroundColor: '#7f92f0',
    padding: 20,
    borderRadius: 8,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    flex: 1, // Take up entire space
  },
  ethicsScrollView: {
    flex: 1,
    width: '100%', // Take up entire width
    paddingHorizontal: 20, // Add horizontal padding
  },
  title: {
    fontSize: 24, 
      fontWeight: 'bold',
      paddingTop: 25,
    marginBottom: 20, // Add more space at the bottom
    textAlign: 'center', // Center the title text
  },
  modalText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'justify', // Align text justified
    },
  agreeButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  agreeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Ethics;
