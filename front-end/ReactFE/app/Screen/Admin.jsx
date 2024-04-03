import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenStyles } from './Screen';
import DrawerButton from '../navigation/CustomDrawerButton';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const Admin = () => {
  const navigation = useNavigation();
  const { onLogout } = useAuth();

  const handleCreateSurvey = () => {
    navigation.navigate("CreateSurvey");
  };
  const handleDownloadResults = () => {
    navigation.navigate("Download/Notify");
  };
  const handleNotify = () => {
    navigation.navigate("Download/Notify");
  }


  return (
    <View style={[ScreenStyles.ScreenStyle, styles.container]}>
      <DrawerButton />
      <View style={styles.header}>
        <Text style={styles.title}>CASI</Text>
        <Text style={styles.subtitle}>ADMIN</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.takeSurveyButton}
          onPress={handleCreateSurvey}
        >
          <Text style={styles.buttonText}>+ Create Survey</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDownloadResults}
        >
          <Text style={styles.buttonText}>Download Results</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNotify}
        >
          <Text style={styles.buttonText}>Notify Users</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 20,
    color: "#ffffff",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  takeSurveyButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
});

export default Admin;
