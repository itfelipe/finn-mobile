import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButtonHeader from "../../components/BackButton";

const FinishScreen: React.FC<{ onStart?: () => void }> = ({ onStart }) => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <BackButtonHeader />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Maravilha!</Text>
          <Text style={styles.subtitle}>Tudo pronto para decolar!</Text>
          {/* Imagem ou animação central */}
          <View style={styles.imageBox}>
            <Image
              source={require("../../assets/finish.png")}
              style={{ width: 300, height: 300 }}
            />
          </View>

          <Text style={styles.infoText}>
            Suas informações estão seguras conosco. Vamos direcioná-lo ao seu
            novo painel de controle, onde suas finanças aguardam para serem
            transformadas.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onStart}>
          <Text style={styles.buttonText}>Começar →</Text>
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
    marginBottom: 12,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#111",
    marginBottom: 18,
  },
  imageBox: {
    width: 170,
    height: 140,
    borderRadius: 8,
    marginVertical: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  imageText: {
    color: "#444",
    fontSize: 15,
    textAlign: "center",
    opacity: 0.8,
  },
  infoText: {
    color: "#222",
    fontSize: 15,
    textAlign: "left",
    marginTop: 2,
    marginBottom: 16,
    maxWidth: 300,
    lineHeight: 22,
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

export default FinishScreen;
