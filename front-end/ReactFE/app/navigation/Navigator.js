import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import Survey from "../Screen/Survey"
import Profile from "../Screen/Profile"
import { createStackNavigator } from "@react-navigation/stack"
import Login from "../Screen/Login"
import SurveyBoard from "../Screen/SurveyBoard"
import SurveyStartBoard from "../Screen/SurveyStartBoard"
import CustomDrawer from "./CustomDrawer"
import { useAuth } from "../context/AuthContext"
import CreateSurvey from "../Screen/CreateSurvey"
import Admin from "../Screen/Admin"



/*Test constants */
const runSurveyCreationTest = false;





const Drawer = createDrawerNavigator();

const AppSurveyStack = createStackNavigator();
const AppMainStack = createStackNavigator();
const AdminDrawer = createDrawerNavigator();

const SurveyStack = () => {
  return (
    <AppSurveyStack.Navigator screenOptions={{
      headerShown: false
    }} initialRouteName="Survey">
      <AppSurveyStack.Screen name="SurveyScreen" component={Survey} />
      <AppSurveyStack.Screen name="SurveyBoard" component={SurveyBoard} />
      <AppSurveyStack.Screen name="SurveyStartBoard" component={SurveyStartBoard} />

    </AppSurveyStack.Navigator>

  );
}

const AdminMainDrawer = () => {
  return (

    <Drawer.Navigator testID={"drawer"} tabBarTestID={"drawer"} id={"drawer"}

      screenOptions={{
        overlayColor: "transparent",
        drawerStyle: {
          backgroundColor: "#5f6fc0"
        },
        screenOptions: {
          backgroundColor: "black",
          fontSize: "2em",

          width: 250,
        },
        cardStyle: {
          backgroundColor: '#7f92f0',
        },
        headerShown: false,
        drawerActiveTintColor: "#26177d",
        drawerLabelStyle: {
          color: "#fff",
          fontSize: 20,
          paddingLeft: 10
        }


      }

      }

      drawerContent={props => <CustomDrawer {...props} />}



      initialRouteName="AdminHome">
      <Drawer.Screen name="AdminHome" testID={"adminHomeID"} component={Admin} />
      <Drawer.Screen name="Create Survey" testID={"createsurvey"} component={CreateSurvey} />

    </Drawer.Navigator>
  )


}

const MainDrawer = () => {

  return (
    <Drawer.Navigator testID={"drawer"} tabBarTestID={"drawer"} id={"drawer"}

      screenOptions={{
        overlayColor: "transparent",
        drawerStyle: {
          backgroundColor: "#5f6fc0"
        },
        screenOptions: {
          backgroundColor: "black",
          fontSize: "2em",

          width: 250,
        },
        cardStyle: {
          backgroundColor: '#7f92f0',
        },
        headerShown: false,
        drawerActiveTintColor: "#26177d",
        drawerLabelStyle: {
          color: "#fff",
          fontSize: 20,
          paddingLeft: 10
        }


      }

      }

      drawerContent={props => <CustomDrawer {...props} />}



      initialRouteName="Home">
      <Drawer.Screen name="Survey" testID={"survID"} component={SurveyStack} />
      <Drawer.Screen name="Profile" testID={"profileID"} component={Profile} />

    </Drawer.Navigator>
  )
}


const MainStack = () => {
  const { authState } = useAuth();
  return (
    <AppMainStack.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#7f92f0"
        },
        screenOptions: {
          backgroundColor: "black",
          fontSize: "2em",

          width: 250,
        },
        cardStyle: {
          backgroundColor: '#7f92f0',
        },
        headerStyle: {
          backgroundColor: "#5d6ebe",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold"
        },
        drawerActiveTintColor: "#26177d",
        drawerLabelStyle: {
          color: "#111"
        }
      }}

      initialRouteName="Home">





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

  )
}




const Navigator = () => {
  const { authState } = useAuth();
  return (
    <MainStack />
  );
}

export default Navigator


/*headerStyle:{
        backgroundColor:"#5d6ebe",
      },
       headerTintColor:"#fff",
       headerTitleStyle:{
        fontWeight:"bold"
       },

       */