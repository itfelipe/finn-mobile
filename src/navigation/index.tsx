import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabs from "./TabNavigator";

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
