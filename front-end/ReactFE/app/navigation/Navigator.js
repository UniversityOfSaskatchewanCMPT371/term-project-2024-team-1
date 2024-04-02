import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "../Screen/Profile";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screen/Login";
import CustomDrawer from "./CustomDrawer";
import { useAuth } from "../context/AuthContext";
import CreateSurvey from "../Screen/CreateSurvey";
import Admin from "../Screen/Admin";
import LandingPage from "../Screen/LandingPage";
import SurveyList from "../Screen/SurveyList";
import TakeSurvey from "../Screen/TakeSurvey"
import SignUp from "../Screen/SignUp";
import SurveyCompleted from "../Screen/SurveyCompleted";
import About from "../Screen/ContactUs";
import ContactUs from "../Screen/ContactUs";
import Logout from "../Screen/Logout";

import ViewResultsAsAdmin from "../Screen/ViewResultsAsAdmin";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";

/*Test constants */
const runSurveyCreationTest = true;

const Drawer = createDrawerNavigator();

const AppSurveyStack = createStackNavigator();
const AppMainStack = createStackNavigator();
const AdminDrawer = createDrawerNavigator();

const SurveyStack = () => {
  return (
    <AppSurveyStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Survey"
    >

      <AppSurveyStack.Screen name="TakeSurvey" component={TakeSurvey} />
      {/* <AppSurveyStack.Screen
        name="SurveyStartBoard"
        component={SurveyStartBoard}
      /> */}
      <AppMainStack.Screen name="Survey Complete" component={SurveyCompleted}/>
    </AppSurveyStack.Navigator>
  );
};


const AdminMainDrawer = () => {
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
      initialRouteName="AdminHome"
    >
      <Drawer.Screen
        name="Home"
        testID={"adminHomeID"}
        component={Admin}
      />
      <Drawer.Screen
        name="CreateSurvey"
        testID={"createsurvey"}
        component={CreateSurvey}
      />
       <Drawer.Screen name="Download/Notify" testID={"Notifications"} component={ViewResultsAsAdmin} />
      <Drawer.Screen name="Logout" testID={"Logout"} component={Logout} />

      
    </Drawer.Navigator>
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
      <Drawer.Screen name="Home" testID={"Home"} component={LandingPage} />
      <Drawer.Screen name="Surveys" testID={"Surveys"} component={SurveyList} />
      <Drawer.Screen
        name="Contact Us"
        testID={"ContactUs"}
        component={ContactUs}
      />
      <Drawer.Screen name="Logout" testID={"Logout"} component={Logout} />
      <Drawer.Screen name="SurveyStack" component={SurveyStack} options={{drawerItemStyle:{height:0}}} />
    </Drawer.Navigator>
  );
};

const MainStack = () => {
  const { authState } = useAuth();
  return (
    <AppMainStack.Navigator
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

      {/* <AppMainStack.Screen name="MainDrawer" component={MainDrawer} />
      <AppMainStack.Screen name="Login" component={Login} />
        <AppMainStack.Screen name="SignUp" component={SignUp} /> */}
      {

        runSurveyCreationTest ? <AppMainStack.Screen name="AdminDrawer" component={AdminMainDrawer} /> :

          authState?.token ? (
            authState?.role === "ADMIN" ? (
              <AppMainStack.Screen name="AdminDrawer" component={AdminMainDrawer} />
            ) : (
              <AppMainStack.Screen name="Home" component={MainDrawer} />
            )
          ) : (
            <AppMainStack.Screen name="Login" component={Login} />
          )

      }
    </AppMainStack.Navigator>
  );
};

const Navigator = () => {
  const { authState } = useAuth();
  return <MainStack />;
};

export default Navigator;
