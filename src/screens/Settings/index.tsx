import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";

// Mock do usuário
const mockUser = {
  name: "Felipe Rocha",
  email: "felipe@email.com",
  avatar:
    "https://ui-avatars.com/api/?name=Felipe+Rocha&background=random&color=fff",
};

// Mock da versão (substitua depois por import do expo-constants se quiser)
const APP_VERSION = "1.0.0";

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Perfil */}
        <View style={styles.profileSection}>
          <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{mockUser.name}</Text>
          <Text style={styles.email}>{mockUser.email}</Text>
        </View>

        {/* Informações do app */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do aplicativo</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Versão</Text>
            <Text style={styles.infoValue}>{APP_VERSION}</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa", padding: 24 },
  profileSection: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 32,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    marginBottom: 16,
    backgroundColor: "#ddd",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  email: {
    fontSize: 15,
    color: "#888",
    marginTop: 2,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 36,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#444",
    fontWeight: "600",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 15,
    color: "#333",
  },
  infoValue: {
    fontSize: 15,
    color: "#666",
  },
  logoutBtn: {
    marginTop: "auto",
    backgroundColor: "#ef4444",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 14,
  },
  logoutText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
