import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import BackButtonHeader from "../../components/BackButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRegistration } from "../../contexts/RegistrationContext";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const navigation = useNavigation();
  const {
    data,
    setEmail: setEmailCtx,
    setPassword: setPasswordCtx,
  } = useRegistration();

  const handleRegister = () => {
    if (senha !== confirmar) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    setEmailCtx(email);
    setPasswordCtx(senha);

    navigation.navigate("NameScreen");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <BackButtonHeader />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.logoText}>Logo</Text>
          <View style={styles.logoBox} />

          <Text style={styles.title}>Cadastrar</Text>
          <TextInput
            style={styles.input}
            placeholder="email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Campo senha com botão olhinho */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showSenha}
            />
            <TouchableOpacity
              onPress={() => setShowSenha((v) => !v)}
              style={styles.eyeIcon}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={showSenha ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Campo confirmar senha com botão olhinho */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="confirmar"
              value={confirmar}
              onChangeText={setConfirmar}
              secureTextEntry={!showConfirmar}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmar((v) => !v)}
              style={styles.eyeIcon}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={showConfirmar ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { opacity: email === "" || senha === "" ? 0.4 : 1 },
            ]}
            onPress={handleRegister}
            disabled={loading || email === "" || senha === ""}
          >
            <Text style={styles.buttonText}>
              {loading ? "Cadastrando..." : "Próximo"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  logoText: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 16,
    color: "#888",
  },
  logoBox: {
    width: 180,
    height: 100,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 24,
  },
  input: {
    width: 260,
    height: 48,
    backgroundColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    width: 260,
    height: 48,
    backgroundColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },
  passwordContainer: {
    width: 260,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 6,
    marginBottom: 12,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
});

export default Register;
