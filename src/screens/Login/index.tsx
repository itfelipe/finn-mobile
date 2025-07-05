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

const API_URL = "http://SEU_BACKEND_URL/api/auth/login";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        email,
        password: senha,
      });
      // Aqui você pode salvar o token e navegar pra home
      Alert.alert("Login realizado com sucesso!");
      // Exemplo: AsyncStorage.setItem('token', response.data.token);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message || "Falha ao fazer login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo (troque por <Image /> se tiver logo) */}
      <Text style={styles.logoText}>Logo</Text>
      <View style={styles.logoBox} />

      <Text style={styles.title}>Login</Text>
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Entrando..." : "Entrar"}
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

export default Login;
