
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from './app/components/SignUp'; // Update with the correct path
import Ethics from './app/components/Ethics'; // Update with the correct path

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Ethics" component={Ethics} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
