import React from "react";
import RootNavigator from "./src/navigation";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <RootNavigator />
    </SafeAreaView>
  );
}
