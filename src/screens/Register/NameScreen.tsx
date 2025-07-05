import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButtonHeader from "../../components/BackButton";
import { useNavigation } from "@react-navigation/native";

const NameScreen: React.FC<{ onContinue?: (name: string) => void }> = ({
  onContinue,
}) => {
  const [name, setName] = useState("");

  const navigation = useNavigation();
  const handleContinue = () => {
    if (onContinue) onContinue(name);
    // Ou navegue para próxima tela, ou salve o nome no contexto
    navigation.navigate("DOBScreen");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <BackButtonHeader />
      <View style={styles.container}>
        {/* Logo */}

        <View style={{ marginTop: 32 }}>
          <Text style={styles.title}>Como podemos te chamar?</Text>
          <View style={{ height: 18 }} />
          <TextInput
            style={styles.input}
            placeholder="Coloque seu nome ou apelido"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { opacity: name.trim() ? 1 : 0.6 }]}
          onPress={handleContinue}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>Continuar →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  input: {
    width: 260,
    height: 48,
    backgroundColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    marginTop: 4,
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

export default NameScreen;
