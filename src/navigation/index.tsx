import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./TabNavigator";
import NewTransactionScreen from "../screens/NewTransaction";
import LoginScreen from "../screens/Login";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import Register from "../screens/Register";
import BirthDateScreen from "../screens/Register/DOBScreen";
import ObjectivesScreen from "../screens/Register/GoalsScreen";
import NameScreen from "../screens/Register/NameScreen";
import FinishScreen from "../screens/Register/FinishScreen";
import { RegistrationProvider } from "../contexts/RegistrationContext";

const Stack = createNativeStackNavigator();

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen
            name="NewTransaction"
            component={NewTransactionScreen}
            options={{
              presentation: "modal",
            }}
          />
        </>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={Register} />
          <Stack.Screen name="FinishScreen" component={FinishScreen} />
          <Stack.Screen name="NameScreen" component={NameScreen} />
          <Stack.Screen name="DOBScreen" component={BirthDateScreen} />
          <Stack.Screen name="GoalsScreen" component={ObjectivesScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <AuthProvider>
      <RegistrationProvider>
        <NavigationContainer>
          <AppRoutes />
        </NavigationContainer>
      </RegistrationProvider>
    </AuthProvider>
  );
}
