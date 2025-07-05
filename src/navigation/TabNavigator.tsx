import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import Dashboard from "../screens/Dashboard";
import Transactions from "../screens/Transactions";
import Budgets from "../screens/Budgets";
import Settings from "../screens/Settings";

const Tab = createBottomTabNavigator();

const AddButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => navigation.navigate("NewTransaction")}
    >
      <Ionicons name="add" size={32} color="#222" />
    </TouchableOpacity>
  );
};

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#222",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: { fontSize: 10, marginBottom: 4 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={Transactions}
        options={{
          tabBarLabel: "Transacoes",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "swap-horizontal" : "swap-horizontal-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={Dashboard}
        options={{
          tabBarButton: (props) => <AddButton />,
        }}
        listeners={{
          tabPress: (e) => {
            // Previne navegação padrão para a rota "Add"
            e.preventDefault();
          },
        }}
      />
      <Tab.Screen
        name="Budgets"
        component={Budgets}
        options={{
          tabBarLabel: "Orcamentos",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Opcoes",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
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
    backgroundColor: "#f5f5f5",
  },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#bbb",
    justifyContent: "center",
    alignItems: "center",
    top: -20,
    zIndex: 2,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default BottomTabs;
