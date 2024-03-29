import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { CheckBox } from "react-native-elements";
import Paginator from "../navigation/Paginator";
import { ScreenStyles } from "./Screen";
import DrawerButton from "../navigation/CustomDrawerButton";

const TakeSurvey = ({ route }) => {
  //const [questions, setQuestions] = useState([]); --- this is needed for when api is done
  const [loading, setLoading] = useState(true);
  const { width } = Dimensions.get("window");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  //--For api call for question in db
  //  useEffect(() => {
  //   const fetchQuestions = async () => {
  //     try {
  //       const response = await fetch("your_api_endpoint_here");
  //       const data = await response.json();
  //       setQuestions(data.questions);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching questions: ", error);
  //       setLoading(false);
  //     }
  //   };
  // fetchQuestions();
  //}, []);

  const questionTypes = [
    { value: "Check Box", label: "Check Box" },
    { value: "Multiple Choice", label: "Multiple Choice" },
    { value: "Written Answer", label: "Written Answer" },
  ];

  // Define questions state and setQuestions function for mock questions
  const [questions, setQuestions] = useState([
    /// this will have to commented out when api endpoint is available
    {
      id: 1,
      type: "Multiple Choice",
      text: "Question 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      options: ["Option A", "Option B", "Option C"],
      selectedOptions: [],
    },
    {
      id: 2,
      type: "Check Box",
      text: "Question 2: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
      options: ["Option X", "Option Y", "Option Z"],
      selectedOptions: [],
    },
    {
      id: 3,
      type: "Written Answer",
      text: "Question 3: Please provide your feedback:",
      writtenAnswer: "",
    },
  ]);

  const handleNext = () => {
    // Pre-condition: Ensure currentQuestionIndex is within the bounds of questions array.
    // Pre-condition: Ensure currentQuestionIndex points to a valid question.

    const currentQuestion = questions[currentQuestionIndex];

    if (
      currentQuestion.type !== "Written Answer" &&
      currentQuestion.selectedOptions.length === 0
    ) {
      alert("Please select an answer before proceeding.");
      return;
    } else if (
      currentQuestion.type === "Written Answer" &&
      currentQuestion.writtenAnswer.trim() === ""
    ) {
      alert("Please fill in your answer before proceeding.");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      // Post-condition: currentQuestionIndex is incremented by 1.
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    // Pre-condition: Ensure currentQuestionIndex is within the bounds of questions array.

    if (currentQuestionIndex > 0) {
      // Post-condition: currentQuestionIndex is decremented by 1.
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOptionSelect = (optionIndex) => {
    // Pre-condition: Ensure currentQuestionIndex is within the bounds of questions array.
    // Pre-condition: Ensure currentQuestionIndex points to a valid question.

    const updatedQuestions = [...questions];

    if (
      currentQuestionIndex >= 0 &&
      currentQuestionIndex < updatedQuestions.length
    ) {
      let selectedOptions = [
        ...updatedQuestions[currentQuestionIndex].selectedOptions,
      ];

      const index = selectedOptions.indexOf(optionIndex);
      if (index !== -1) {
        selectedOptions.splice(index, 1);
      } else {
        selectedOptions = [optionIndex];
      }

      updatedQuestions[currentQuestionIndex].selectedOptions = selectedOptions;
      setQuestions(updatedQuestions);
    } else {
      console.error("Invalid current question index:", currentQuestionIndex);
      console.error("Updated questions:", updatedQuestions);
    }
  };

  const handleWrittenAnswerChange = (text) => {
    // Pre-condition: Ensure currentQuestionIndex is within the bounds of questions array.

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].writtenAnswer = text;
    setQuestions(updatedQuestions);
    // Post-condition: writtenAnswer of current question is updated with text.
  };

  // Pre-condition: Ensure `question` is an object.
  const renderQuestionInput = (question) => {
    const containerWidth = Dimensions.get("window").width - 20;
    const inputWidth = containerWidth - 40;
    switch (question.type) {
      case "Multiple Choice":
        return (
          <View style={styles.answersContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  question.selectedOptions.includes(index) &&
                    styles.selectedOption,
                ]}
                onPress={() => handleOptionSelect(index)}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case "Check Box":
        return (
          <View style={styles.answersContainer}>
            {question.options.map((option, index) => (
              <View key={index} style={styles.checkboxContainer}>
                <CheckBox
                  checked={question.selectedOptions.includes(index)}
                  onPress={() => handleOptionSelect(index)}
                />
                <Text style={styles.checkboxLabel}>{option}</Text>
              </View>
            ))}
          </View>
        );
      case "Written Answer":
        return (
          <TextInput
            style={[styles.input, { width: inputWidth }]}
            multiline={true}
            placeholder="Your answer..."
            onChangeText={handleWrittenAnswerChange}
          />
        );
      default:
        return null;
    }
  };

  // if (loading) { loading screen when fetching questions
  //   return <Text>Loading...</Text>;
  // }

  return (
    <ScrollView
      contentContainerStyle={[ScreenStyles.CasiBlue, styles.container]}
    >
      <DrawerButton />
      <View style={styles.contentContainer}>
        <View>
          <View style={[styles.questionContent, { width }]}>
            <Text style={styles.questionText}>
              {questions[currentQuestionIndex].text}
            </Text>
            {renderQuestionInput()}
          </View>
        </View>
        {currentQuestionIndex > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      <Paginator
        data={questions}
        scrollX={scrollX}
        index={currentQuestionIndex}
        style={styles.paginator}
      />
    </ScrollView>
  );
};

export default TakeSurvey;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  contentContainer: {
    flex: 1,
    marginTop: 35,
    backgroundColor: "rgba(241, 242, 246, 0.8)",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    width: Dimensions.get("window").width - 20,
    marginBottom: 20,
  },
  questionContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  questionText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: "#5d6ebe",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#5d6ebe",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  paginator: {
    position: "absolute",
    marginTop: 30,
    bottom: 50,
    alignSelf: "center",
  },
  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#5d6ebe",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    height: 150,
  },
  answersContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  selectedOption: {
    backgroundColor: "#5d6ebe",
    borderColor: "#5d6ebe",
    color: "#ffffff",
  },
});
