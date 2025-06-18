// src/navigation/BottomTabs.tsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Dashboard from "../screens/Dashboard";
import Settings from "../screens/Settings";

const Tab = createBottomTabNavigator();

const AddButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.addButton} onPress={onPress}>
    <Ionicons name="add" size={30} color="#fff" />
  </TouchableOpacity>
);

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Add"
        component={Dashboard}
        options={{
          tabBarButton: (props) => (
            <AddButton onPress={() => console.log("Adicionar Transação")} />
          ),
        }}
      />

      <Tab.Screen
        name="Transactions"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: "#fff",
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});
