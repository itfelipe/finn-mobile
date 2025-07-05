import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

const API_URL = "http://SEU_BACKEND_URL/api/auth/register";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (senha !== confirmar) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }
    setLoading(true);
    try {
      await axios.post(API_URL, {
        email,
        password: senha,
      });
      Alert.alert("Cadastro realizado com sucesso!");
      // Aqui você pode navegar pro login, por exemplo
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message || "Falha ao cadastrar"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
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
      <TextInput
        style={styles.input}
        placeholder="senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="confirmar"
        value={confirmar}
        onChangeText={setConfirmar}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Cadastrando..." : "Criar conta"}
        </Text>
      </TouchableOpacity>
    </View>
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
});

export default Register;
