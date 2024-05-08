import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./Screens/Home";
import Details from "./Screens/Details";
import LoginScreen from "./Screens/LoginScreen";
import SignupScreen from "./Screens/SignupScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: true, headerTitle: "Home" }}
        />
        <Stack.Screen
          name="Details"
          component={Details}
          options={{ headerShown: true, headerTitle: "Update Todo" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
