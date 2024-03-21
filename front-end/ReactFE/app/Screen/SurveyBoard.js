import {
  View,
  Text,
  FlatList,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";
import { ScreenStyles } from "./Screen";
import DrawerButton from "../navigation/CustomDrawerButton";
import SurveyModal from "./SurveyModal";
import Paginator from "../navigation/Paginator";

export default function SurveyBoard(props) {
  const surveyData = props.route.params.surveyData;
  const [currentIndex, setCurrentIndex] = useState(0);
  let defaultSurveyValues = {};
  const [surveyResult, setSurveyResult] = useState(
    surveyData.reduce((acc, item) => {
      acc[item.id] = { encountered: false, number: 0, frequency: 0 };
      return acc;
    }, {})
  );

  const scrollx = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);
  const { width } = useWindowDimensions();
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    console.log(viewableItems);
    if (viewableItems[0] !== undefined) setCurrentIndex(viewableItems[0].index);
  }).current;
  const updateResult = (data, id) => {
    let newRes = { ...surveyResult };
    newRes[id] = data;
    setSurveyResult(newRes);

    console.log(surveyResult);
  };

  const handleNext = () => {
    slideRef.current.scrollToIndex({ index: currentIndex + 1, Animated: true });
  };

  const handleSubmit = () => {
    console.log(surveyResult);
  };
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  return (
    <View style={[ScreenStyles.ScreenStyle, { flex: 1 }]}>
      <DrawerButton />

      <View
        style={{ flex: 0.2, justifyContent: "center", alignContent: "center" }}
      >
        <Text style={{ color: "#fff", fontSize: 50, fontWeight: "bold" }}>
          Survey
        </Text>
      </View>
      <View
        style={[
          { flex: 0.8, marginHorizontal: 10, marginBottom: 10 },
          ScreenStyles.modal,
        ]}
      >
        <View
          style={[{ flex: 3, alignItems: "stretch" }]}
          testID="surveyModalCard"
        >
          <FlatList
            data={surveyData}
            renderItem={({ item }) => (
              <SurveyModal
                updateResult={updateResult}
                data={surveyData}
                scrollX={scrollx}
                item={item}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollx } } }],
              {
                useNativeDriver: false,
              }
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slideRef}
          />
          <View
            style={[
              {
                flex: 0.2,
                paddingTop: 10,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Paginator data={surveyData} scrollX={scrollx} />

            {currentIndex < Object.keys(surveyData).length - 1 && (
              <View
                testID={"nextModal"}
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  width: width - 20,
                  paddingRight: 20,
                  paddingBottom: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleNext()}
                  style={{
                    backgroundColor: "darkblue",
                    borderRadius: 10,
                    height: 50,
                    width: 100,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 20,
                      padding: 10,
                    }}
                  >
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {currentIndex == Object.keys(surveyData).length - 1 && (
              <View
                testID={"nextModal"}
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  width: width - 20,
                  paddingRight: 20,
                  paddingBottom: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  style={{
                    backgroundColor: "darkblue",
                    borderRadius: 10,
                    height: 50,
                    width: 100,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 20,
                      padding: 10,
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View />
          </View>
        </View>
      </View>
    </View>
  );
}
