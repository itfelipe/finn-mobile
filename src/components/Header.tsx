import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type HeaderProps = {
  userName: string;
  month: string;
  onMonthPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({
  userName,
  month,
  onMonthPress,
  leftIcon,
  rightIcon,
}) => {
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="person-circle-outline" size={32} color="#555" />
        <Text style={styles.username}>{userName}</Text>
      </View>

      <TouchableOpacity style={styles.monthSelector} onPress={onMonthPress}>
        <Text style={styles.monthText}>{month}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#bbb",
  },
  username: {
    fontWeight: "600",
    fontSize: 18,
    marginLeft: 10,
  },
  monthSelector: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default Header;
