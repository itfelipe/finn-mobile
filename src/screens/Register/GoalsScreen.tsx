import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButtonHeader from "../../components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { useRegistration } from "../../contexts/RegistrationContext";
import { useAuth } from "../../contexts/AuthContext";
import { useRegister } from "../../hooks/useAuthApi";

const OBJECTIVES = [
  "Economizar",
  "Investir",
  "Organização",
  "testar",
  "Investir",
  "Economizar",
  "Economizar",
  "Investir",
  "Organização",
  "testar",
];

const ObjectivesScreen: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const { setObjectives, data } = useRegistration();
  const { signIn } = useAuth();
  const navigation = useNavigation();

  const { register, loading } = useRegister();

  const toggleObjective = (item: string, index: number) => {
    const uniqueId = item + index;
    setSelected((old) =>
      old.includes(uniqueId)
        ? old.filter((i) => i !== uniqueId)
        : [...old, uniqueId]
    );
  };

  const handleContinue = async () => {
    // Mapeia os textos dos objetivos selecionados
    const values = selected.map((id) => {
      const match = id.match(/^(.*?)(\d+)$/);
      if (!match) return id;
      const idx = Number(match[2]);
      return OBJECTIVES[idx];
    });

    setObjectives(values);

    if (!data.name || !data.email || !data.password) {
      Alert.alert("Dados incompletos", "Preencha todas as etapas do cadastro");
      return;
    }

    try {
      // Chama o endpoint de cadastro com todos os dados necessários
      const user = await register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      console.log(user, "ih lalau");

      signIn(user);

      navigation.navigate("FinishScreen");
    } catch (error: any) {
      Alert.alert(
        "Erro ao cadastrar",
        error?.response?.data?.error || "Falha ao cadastrar usuário"
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <BackButtonHeader />
      <View style={styles.container}>
        <View style={{ marginTop: 32, width: "100%" }}>
          <View style={styles.row}>
            <Text style={styles.title}>Qual são seus objetivos?</Text>
            <TouchableOpacity>
              <Text style={styles.info}>?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsWrap}>
            {OBJECTIVES.map((item, idx) => {
              const isSelected = selected.includes(item + idx);
              return (
                <TouchableOpacity
                  key={item + idx}
                  style={[
                    styles.objButton,
                    isSelected
                      ? styles.objButtonActive
                      : styles.objButtonInactive,
                  ]}
                  onPress={() => toggleObjective(item, idx)}
                >
                  <Text
                    style={[styles.objText, isSelected && styles.objTextActive]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { opacity: selected.length ? 1 : 0.6 }]}
          onPress={handleContinue}
          disabled={!selected.length || loading}
        >
          {loading ? (
            <ActivityIndicator color="#222" />
          ) : (
            <Text style={styles.buttonText}>Continuar →</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... seus estilos anteriores aqui ...
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  logoText: {
    marginTop: 10,
    fontSize: 18,
    color: "#222",
    alignSelf: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    color: "#111",
    marginBottom: 8,
  },
  info: {
    fontSize: 18,
    color: "#555",
    marginLeft: 6,
    backgroundColor: "#eee",
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 14,
  },
  objButton: {
    minWidth: 120,
    borderWidth: 1.5,
    borderColor: "#222",
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 10,
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  objButtonActive: {
    backgroundColor: "#d2d2d2",
    borderColor: "#d2d2d2",
  },
  objButtonInactive: {
    backgroundColor: "#fff",
    borderColor: "#222",
  },
  objText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 16,
  },
  objTextActive: {
    color: "#222",
  },
  button: {
    width: 260,
    height: 48,
    backgroundColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
});

export default ObjectivesScreen;
