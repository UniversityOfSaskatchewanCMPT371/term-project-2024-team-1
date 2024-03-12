import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Survey from "../Survey";
import Profile from "../Profile";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Login";
import SurveyBoard from "../SurveyBoard";
import SurveyStartBoard from "../SurveyStartBoard";
import SurveyCompleted from "../SurveyCompleted";
import CustomDrawer from "./CustomDrawer";
import { useAuth } from "../../context/AuthContext";

const Drawer = createDrawerNavigator();

const SurveyStack = () => {
  return (
    <AppSurveyStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Survey"
    >
      <AppSurveyStack.Screen name="SurveyScreen" component={Survey} />
      <AppSurveyStack.Screen name="SurveyBoard" component={SurveyBoard} />
      <AppSurveyStack.Screen
        name="SurveyStartBoard"
        component={SurveyStartBoard}
      />
      {/*<AppSurveyStack name ='SurveyCompleted' component={SurveyCompleted}/>
      Stub in place for how I think the surveycompleted page should work with the nav?
      */}
      <AppSurveyStack name="SurveyCompleted" component={SurveyCompleted} />
    </AppSurveyStack.Navigator>
  );
};

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      testID={"drawer"}
      tabBarTestID={"drawer"}
      id={"drawer"}
      screenOptions={{
        overlayColor: "transparent",
        drawerStyle: {
          backgroundColor: "#5f6fc0",
        },
        screenOptions: {
          backgroundColor: "black",
          fontSize: "2em",

          width: 250,
        },
        cardStyle: {
          backgroundColor: "#7f92f0",
        },
        headerShown: false,
        drawerActiveTintColor: "#26177d",
        drawerLabelStyle: {
          color: "#fff",
          fontSize: 20,
          paddingLeft: 10,
        },
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Survey" testID={"survID"} component={SurveyStack} />
      <Drawer.Screen name="Profile" testID={"profileID"} component={Profile} />
    </Drawer.Navigator>
  );
};

const AppSurveyStack = createStackNavigator();
const AppMainStack = createStackNavigator();

const MainStack = () => {
  const { authState } = useAuth();
  return (
    <AppMainStack.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#7f92f0",
        },
        screenOptions: {
          backgroundColor: "black",
          fontSize: "2em",

          width: 250,
        },
        cardStyle: {
          backgroundColor: "#7f92f0",
        },
        headerStyle: {
          backgroundColor: "#5d6ebe",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerActiveTintColor: "#26177d",
        drawerLabelStyle: {
          color: "#111",
        },
      }}
      initialRouteName="Home"
    >
      {authState?.token ? (
        <AppMainStack.Screen name="Home" component={MainDrawer} />
      ) : (
        <AppMainStack.Screen name="Login" component={Login} />
      )}
    </AppMainStack.Navigator>
  );
};

const Navigator = () => {
  return <MainStack />;
};

export default Navigator;

/*headerStyle:{
          backgroundColor:"#5d6ebe",
        },
         headerTintColor:"#fff",
         headerTitleStyle:{
          fontWeight:"bold"
         },

         */
